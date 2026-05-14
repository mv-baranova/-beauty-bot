/**
 * Mock provider for image generation.
 * Returns high-quality fashion images from Unsplash.
 */

async function generate(prompt) {
  console.log(`[Mock Provider] Generating image for prompt: ${prompt}`);

  // A set of high-quality fashion images that fit the "Pinterest aesthetic, soft luxury, clean girl" vibe
  const mockImages = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1000&auto=format&fit=crop',
  ];

  const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(randomImage);
    }, 1500);
  });
}

module.exports = {
  generate,
};
