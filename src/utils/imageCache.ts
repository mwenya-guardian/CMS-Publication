
export const preloadImage = async (newImageUrl: string | undefined, id: string ) => {
  if (newImageUrl && newImageUrl.length > 0) {
    try {
      // fetch the image once; instruct browser to use its HTTP cache if present
      const res = await fetch(newImageUrl, { cache: 'force-cache' });
      if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      console.log("Url:" , blobUrl)
        return {
          blobUrl: blobUrl
        };
    } catch (error) {
      console.warn('Failed to preload image for ',id ,error);
      // fall back to the original URL if preload fails
      return {
        blobUrl: undefined
      };
    }
  }
  return {
    blobUrl: undefined
  };
}