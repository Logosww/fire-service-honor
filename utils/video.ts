import moment from 'moment';

export const getVideoDuration = (video: File | Blob | MediaSource) => new Promise<string>(resolve=> {
  const durationFormat = (duration: number) => {
    const _duration = moment.duration(duration, 'second');
    return moment.utc(_duration.asMilliseconds()).format('mm:ss')
  };

  if(video instanceof MediaSource) return resolve(durationFormat(video.duration));
  else {
    const dataURI = URL.createObjectURL(video);
    const videoEle = document.createElement('video');
    videoEle.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(dataURI);
      resolve(durationFormat(videoEle.duration));
    })
    videoEle.src = dataURI;
  }
});