export default function decorate(block) {
  [...block.children].forEach((row, r) => {
    if (r === 0){
      row.classList.add("floating-footer-div");
    }
    if (r === 1){
      row.classList.add("imp-footer-links");
    }
    if (r === 2){
      row.classList.add("footer-copyright");
    }
    if (r === 3){
      row.classList.add("footer-other-links");
    }
  });
}
