export default function decorate(block) {
  [...block.children].forEach((row, r) => {
    if (r === 0) {
      row.classList.add('banner-desktop');
    }
    if (r === 1) {
      row.classList.add('banner-mobile');
    }
  });
}
