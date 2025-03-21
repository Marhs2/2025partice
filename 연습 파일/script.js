fetch("./product.json")
  .then((re) => {
    return re.json();
  })
  .then((data) => {
    Object.keys(data.product).forEach((item) => {
      const tem = data.product[item];
      const content = document.querySelector(".content");
      const container = document.createElement("div");
      const itembox = document.createElement("div");
      container.classList.add("container");
      itembox.classList.add("itemBox");
      let number = 1;
      tem.forEach((e) => {
        itembox.innerHTML += `
        <div>
      <div class="img-box">
      <img
      src="/선수제공파일/A-Module/images/${item}/${number}.PNG"
      alt="${item}-Img${number}"
      />
      </div>
      
      <div class="text-content">
      <div>
      <div>
        <p>${e.title}</p>
      </div>
      </div>
      
      <div>
      <p class="fa">
        &#xf155;${e.price}
      </p>
      </div>
      <div>
      <p>${e.delivery}</p>
      </div>
      <div class="btn">
      <a href="#">구매하기</a>
      <a href="#">장바구니담기 </a>
      </div>
      </div>
      </div>
      
        `;
        number++;
      });
      console.log(itembox);
      container.innerHTML = itembox.outerHTML;
      console.log(container);
      content.innerHTML += container.outerHTML;
    });
  });
