import COS from 'cos-js-sdk-v5';

import { nanoid } from 'nanoid';
import { COSBucketBaseUrl } from '@/constants';

import type { ProgressInfo } from 'cos-js-sdk-v5';

const config = {
  bucketName: 'pams-1318030356',
  bucketRegion: 'ap-shanghai'
};

const cos = ref<COS>();

export const useCOSUpload = async (
  onProgress?: (params: ProgressInfo) => void,
  returnUrl?: boolean
) => {
  if(process.server) return { upload: () => Promise.resolve('') };

  let globalOnProgress = onProgress;
  const { data: bucketSecret, refresh: getCOSSecret } = await useGetCOSSecret();

  if(!cos.value) cos.value = new COS({
    async getAuthorization(_options, callback) {
      await getCOSSecret();
      const data = bucketSecret.value;
      const { credentials } = data;
      callback({
        TmpSecretId: credentials.tmpSecretId,
        TmpSecretKey: credentials.tmpSecretKey,
        SecurityToken: credentials.sessionToken,
        StartTime: data.startTime,
        ExpiredTime: data.expiredTime
      });
      },
    }
  );

  const upload = (file: File, path?: string, onProgress?: (params: ProgressInfo) => void,) => {
    const extension = file.name.split('.').at(-1);
    const generateKey = () => {
      const { type } = file;
      return `${ type.startsWith('image') ? 'image' : 'temp' }/${nanoid()}.${extension}`
    };
    return new Promise<string>(async (resolve, reject) => {
      try {
        const key = path ?? generateKey();
        await cos.value!.uploadFile(
          {
            Bucket: config.bucketName,
            Region: config.bucketRegion,
            Key: key,
            Body: file,
            onProgress: onProgress ?? globalOnProgress
          }
        );
        resolve(returnUrl ? `${COSBucketBaseUrl}/${key}` : key);
      } catch(err) {
        reject(err)
      }
    });
  };

  return {
    upload
  };
};