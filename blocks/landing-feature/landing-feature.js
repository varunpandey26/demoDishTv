export default function decorate(block) {
  [...block.children].forEach((row, r) => {
      row.classList.add('feature-landing-row-' + r);
      [...row.children].forEach((div) => {      
        div.classList.add('feature-col');

        const headTags = div.querySelector('h3');
        headTags.classList.add('card-title');

        const ptags = div.querySelectorAll('p');
        ptags.forEach((p,i) => {
          if (i === 0) {
            p.classList.add('card-img');
          }
          if(i === 1){
            p.classList.add('card-desc');
          }
        });
    });
  });
}
