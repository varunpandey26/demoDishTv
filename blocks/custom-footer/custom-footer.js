export default function decorate(block) {
  [...block.children].forEach((row, r) => {
    if (r === 0) {
      row.classList.add('floating-footer-div');
      [...row.children].forEach((col, c) => {
        if (c === 0) col.classList.add('floating-footer-title-section');
        if (c === 1) col.classList.add('floating-footer-links-section');
      });
    }
    if (r === 1) {
      row.classList.add('imp-footer-links');
      [...row.children].forEach((col) => {
        col.classList.add('footer-link-column');
      });
    }
    if (r === 2) {
      row.classList.add('footer-copyright');
      [...row.children].forEach((col, c) => {
        if (c === 0) col.classList.add('footer-logo');
        if (c === 1) col.classList.add('footer-copyright-text');
      });
    }
    if (r === 3) {
      row.classList.add('footer-other-links');
      [...row.children].forEach((col) => {
        col.classList.add('footer-bottom-links');
      });
    }
  });
}

