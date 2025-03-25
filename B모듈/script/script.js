function imgsChange() {
  const imgs = Array.from(document.querySelector(".imgsBox").children);

  imgs.forEach((e) => {
    e.addEventListener("mouseenter", () => {
      const des = e.querySelector(".des");
      des.style.opacity = "1";
      imgs.forEach((item) => {
        item.style.backgroundImage = `url(/B모듈/imgs/${e.className}.JPG)`;
      });
    });

    e.addEventListener("mouseleave", () => {
      const des = e.querySelector(".des");
      des.style.opacity = "0";
      imgs.forEach((item) => {
        item.style.backgroundImage = `url(/B모듈/imgs/${item.className}.JPG)`;
      });
    });
  });
}

imgsChange()