export function CarouselBanner({image_location}){


    return(
        <div className="w-full h-full overflow-hidden flex justify-center items-center object-cover">
            <img 
                src={image_location} 
                alt="Banner"
                className="w-auto h-full"
            />
        </div>
    )
}




function getMostFrequentColor(imageElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas dimensions to match the image
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;

  // Draw the image onto the canvas
  ctx.drawImage(imageElement, 0, 0);

  // Get pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  const colorCount = {};
  let maxCount = 0;
  let mostFrequentColor = '';

  // Iterate through pixels (RGBA format)
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const color = `${r},${g},${b}`;

    // Count occurrences of each color
    colorCount[color] = (colorCount[color] || 0) + 1;

    if (colorCount[color] > maxCount) {
      maxCount = colorCount[color];
      mostFrequentColor = color;
    }
  }

  return `rgb(${mostFrequentColor})`;
}

