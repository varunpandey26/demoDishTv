export default function decorate(block) {
  [...block.children].forEach((row, r) => {
    if (r === 0){
        row.classList.add("choose-heading");
        const h2Tag = row.querySelector('h2');
        h2Tag.classList.add('choose-title');

        const h3Tag = row.querySelector('h3');
        h3Tag.classList.add('choose-desc');
    }
    else {
        row.classList.add("choose-cards-div");
        [...row.children].forEach((div) => {      
          div.classList.add('choose-card');
          [...div.children].forEach((child) => {      
            const ptags = div.querySelectorAll('p');
            ptags.forEach((p,i) => {
              if (i === 0) {
                p.classList.add('choose-card-img');
              }
              if(i === 1){
                p.classList.add('choose-card-desc');
              }
            });
          });
        });
    }
  });
}
