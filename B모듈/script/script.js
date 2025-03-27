function imgsChange() {
  const imgs = Array.from(document.querySelector(".imgsBox").children);

  imgs.forEach((e) => {
    e.addEventListener("mouseenter", () => {
      const desName = $(`.des${e.className.replace(/[^0-9]/g , '')}`)
      desName.get(0).style.opacity = "1";
      desName.get(0).style.visibility = "visible";  
      imgs.forEach((item) => {
        item.style.backgroundImage = `url(/B모듈/imgs/${e.className}.JPG)`;
      });
    });

    e.addEventListener("mouseleave", () => {
      const desName = $(`.des${e.className.replace(/[^0-9]/g , '')}`)
      desName.get(0).style.opacity = "0";
      desName.get(0).style.visibility = "hidden";  
      imgs.forEach((item) => {
        item.style.backgroundImage = `url(/B모듈/imgs/${item.className}.JPG)`;
      });
    });
  });
}

imgsChange();
