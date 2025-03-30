const video = $(".video > video").get(0);
const ctrlo = $(".control").get(0);
const userInfo = $(".user-info .number");
let total = 0;

function unknowUser() {
  [...userInfo].forEach((e) => {
    const rannum = Math.floor(Math.random() * 10);
    e.textContent = rannum;
  });
}

unknowUser();

function videoCtrl() {
  $(".video-ctrl ").change(() => {
    $("#loop").is(":checked") ? (video.loop = true) : (video.loop = false);
    $("#autoplay").is(":checked")
      ? (video.autoplay = true)
      : (video.autoplay = false);
  });
  $(".pause").on("click", () => {
    video.pause();
  });
  $(".start").on("click", () => {
    video.play();
  });
  $(".stop").on("click", () => {
    video.pause();
    video.currentTime = 0;
  });
  $("#hide").change(() => {
    ctrlo.style.display = $("#hide").is(":checked") == true ? "none" : "block";
  });
  $(".back").on("click", () => {
    video.currentTime -= 10;
  });
  $(".forward").on("click", () => {
    video.currentTime += 10;
  });
  $(".10plus").on("click", () => {
    video.playbackRate -= 0.1;
  });
  $(".10minus").on("click", () => {
    video.playbackRate += 0.1;
  });
  $(".speed-Back").on("click", () => {
    video.playbackRate = 1;
  });
}

function modal() {
  $(".buy").on("click", () => {
    $(".modal").css("display", "block");
    $("body").css("overflow", "hidden");
  });

  $(".modal-close").on("click", () => {
    $(".modal").css("display", "none");
    $("body").css("overflow", "visible");
  });
}

let totalPrice = 0;

function priceChange() {
  function change() {
    [...$(".drop .itemBox")].forEach((e) => {
      let total = 0;
      const count = $(e).find(".itemCount ").val();
      const itemprice = $(e)
        .find(".itemPrice")
        .get(0)
        .textContent.replace(/[^0-9]/g, "");
      const itemtotalprice = $(e).find(".itemTotalPrice").get(0);
      total = count * itemprice;
      totalPrice += total;
      itemtotalprice.textContent = total.toLocaleString("en-us");
    });
    $(".totalPrice").get(0).textContent = `${totalPrice.toLocaleString(
      "en-us"
    )}원`;
    totalPrice = 0;
  }

  change();

  $(".drop").change(() => {
    change();
  });
}

function drag() {
  function resotre(id) {
    $(`.items .itemBox[data-id="${id}"]`).css("opacity", 1).draggable("enable");
  }

  $(".items .itemBox").each((i, el) => {
    $(el).attr("data-id", `orig-${i}`).draggable({
      helper: "clone",
    });
  });

  $(".drop").droppable({
    accept: ".itemBox:not(.cloned)",

    drop(evnet, ui) {
      const $orig = ui.draggable;
      const id = $orig.data("id");

      const $clone = $orig

        .clone()
        .css({ position: "", top: "", left: "", opacity: 1 })
        .removeClass("ui-draggable ui-draggable-handle")
        .addClass("cloned")
        .attr("data-id", id)
        .appendTo(this);

      $clone.draggable({
        start(e, item_ui) {},

        stop(e, item_ui) {
          if (!$(this).data("returned")) {
            resotre($(this).data("id"));
            $(this).remove();
          }
        },
      });

      $orig.css("opacity", 0.3).draggable("disable");

      $clone.find(".text-content").get(0).innerHTML += `<div>
      <span>개수: </span>
      <input type="number" class="itemCount" value="1" min="1" />
      </div>
      <div>
      <span>총 가격: </span>
      <span class="itemTotalPrice">65,000</span>
      </div>`;
      priceChange();
    },
  });

  $("body").droppable({
    accept: ".cloned",

    drop(event, ui) {
      const $clone = ui.draggable;
      resotre($clone.data("id"));
      $clone.data("returned", true).remove();
      priceChange();
    },
  });
}

function category() {
  fetch("./product.json")
    .then((res) => res.json())
    .then((obj) => {
      const itemContaienr = $(".items").get(0);
      const category = $(".cataegory div");
      [...category].forEach((btn) => {
        btn.addEventListener("click", () => {
          itemContaienr.innerHTML = "";
          category.innerHTML = "";
          Object.keys(obj.product[btn.textContent]).forEach((e, idx) => {
            const item = obj.product[btn.textContent][e];
            const newItem = document.createElement("div");
            newItem.classList.add("itemBox");

            newItem.innerHTML = `
              <div class="drag">
                <div class="img-box">
                  <img
                    src="/선수제공파일/A-Module/images/${btn.textContent}/${
              idx + 1
            }.PNG"
                    alt="${btn.textContent}-${idx + 1}"
                  />
                </div>

                <div class="text-content">
                  <div>
                    <div>
                      <p class="item-Name"> ${item["title"]}</p>
                    </div>
                  </div>

                  <div>
                    <p class="fa">
                      &#xf155; 가격 <span class="itemPrice">${
                        item["price"]
                      }</span>
                    </p>
                  </div>
                </div>
              </div>
              `;

            itemContaienr.appendChild(newItem);

            if (
              $(`.drop .itemBox:has(.item-Name[content="${item['title']}"])`)
            ) {
              console.log(
                $(`.items .itemBox:has(.item-Name[content="${item['title']}"])`)
              );
              $(`.items .itemBox:has(.item-Name:contains[content="${item['title']}"])`)
                .css("opacity", 0.3)
                .draggable("disable");
            } else {
              console.log("없음");
            }
          });
          drag();
        });
      });

      function start() {
        Object.keys(obj.product["건강식품"]).forEach((e, idx) => {
          const item = obj.product["건강식품"][e];
          const newItem = document.createElement("div");
          newItem.classList.add("itemBox");

          newItem.innerHTML = `
            <div class="drag">
              <div class="img-box">
                <img
                  src="/선수제공파일/A-Module/images/건강식품/${idx + 1}.PNG"
                  alt="건강식품-${idx + 1}"
                />
              </div>
      
              <div class="text-content">
                <div>
                  <div>
                    <p class="item-Name">${item["title"]}</p>
                  </div>
                </div>
      
                <div>
                  <p class="fa">
                    &#xf155; 가격 <span class="itemPrice">${
                      item["price"]
                    }</span>
                  </p>
                </div>
              </div>
            </div>
            `;
          itemContaienr.appendChild(newItem);
        });
        drag();
      }

      start();
    });
}
drag();
category();
modal();
videoCtrl();
