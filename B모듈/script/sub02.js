const video = $(".video > video").get(0);
const ctrlo = $(".control").get(0);
const userInfo = $(".user-info .number");

function unknowUser() {
  [...userInfo].forEach((e) => {
    const rannum = Math.floor(Math.random() * 10);
    e.textContent = rannum;
  });
}

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
    ctrlo.style.display = $("#hide").is(":checked") ? "none" : "flex";
  });
  $(".back").on("click", () => {
    video.currentTime -= 10;
  });
  $(".forward").on("click", () => {
    video.currentTime += 10;
  });
  $(".10plus").on("click", () => {
    video.playbackRate += 0.1;
  });
  $(".10minus").on("click", () => {
    video.playbackRate -= 0.1;
  });
  $(".speed-Back").on("click", () => {
    video.playbackRate = 1;
  });
}

function modal() {
  $(".buy").on("click", () => {
    $(".modal").css("display", "flex");
    $("body").css("overflow", "hidden");

    priceChange();
  });

  $(".modal-close").on("click", () => {
    $(".modal").css("display", "none");
    $("body").css("overflow", "visible");
  });
}

function priceChange() {
  let currentTotalPrice = 0;
  $(".drop .itemBox.cloned").each((index, element) => {
    const count = parseInt($(element).find(".itemCount").val()) || 0;
    const itemPriceText = $(element).find(".itemPrice")?.text() || "0";
    const itemprice = parseInt(itemPriceText.replace(/[^0-9]/g, "")) || 0;
    const itemTotalPriceElement = $(element).find(".itemTotalPrice");
    const itemTotal = count * itemprice;
    currentTotalPrice += itemTotal;
    if (itemTotalPriceElement.length) {
      itemTotalPriceElement.text(itemTotal.toLocaleString("en-us"));
    }
  });
  $(".totalPrice").text(`${currentTotalPrice.toLocaleString("en-us")}원`);
}

function makeSourceItemDraggable(itemEl) {
  // Source items use a simple clone helper and revert if not dropped on .drop
  $(itemEl).draggable({
    helper: "clone", appendTo: 'body', zIndex: 9999, revert: 'invalid'
  });
}

function setupDroppables() {
  // --- Drop Area (.drop) Setup ---
  $(".drop").droppable({
    accept: ".itemBox", // Accept source items AND clones from the cart
    drop: function(event, ui) {
      const $dropped = ui.draggable; // The original element being dragged
      const id = $dropped.data("id");

      // Case 1: Dropped a source item (from outside the cart)
      if (!$dropped.hasClass('cloned')) {
        const $existing = $(this).find(`.itemBox.cloned[data-id="${id}"]`);

        if ($existing.length) { // Source item already in cart -> Increment
          const $input = $existing.find('.itemCount');
          $input.val((parseInt($input.val()) || 0) + 1);
          priceChange(); // Assumes priceChange() exists
        } else { // Source item is new -> Add clone to cart
          const $clone = $dropped.clone()
            .css({ position: "relative", top: "0px", left: "0px", opacity: 1, visibility: 'visible' }) // Use relative positioning
            .removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging")
            .addClass("cloned")
            .attr("data-id", id)
            .appendTo(this);

          // Append controls
          $clone.find(".text-content").append(`
            <div style="margin-top: 5px;">
              <span>개수:</span> <input type="number" class="itemCount" value="1" min="1" style="width:50px;"/>
            </div>
            <div>
              <span>총 가격:</span> <span class="itemTotalPrice">0</span>원
            </div>`);

          // Make the NEW clone in the cart draggable
          $clone.draggable({
            helper: 'clone',        // Use a clone helper for stability
            appendTo: 'body',       // Essential for visibility
            zIndex: 9999,
            cursor: 'move',
            revert: 'invalid',   // *** Key: Helper reverts if drop isn't accepted by logic ***
            containment: 'document',

            start: function(event, ui) {
                // Reset the flag at the beginning of each drag
                $(this).data('droppedValidly', false);
                 // Optional: Store original position if needed for precise snap-back later
                $(this).data('originalPosition', $(this).position());
            },
            stop: function(event, ui) {
                // This executes AFTER the drop handler (if any) and AFTER revert animation (if any)

                // Check if the flag was set to true by a valid drop handler (.drop or body)
                if (!$(this).data('droppedValidly')) {
                    // If the flag is STILL false, it means it was dropped somewhere invalid.
                    // The 'revert: invalid' handles the visual return of the helper.
                    // NOW, remove the original clone element from the cart.
                    $(this).remove();
                    priceChange(); // Assumes priceChange() exists
                }
                // If droppedValidly was true, do nothing here - the element stays.
                // Reset the flag for the next drag operation
                $(this).removeData('droppedValidly');
                // Optional: If visual position is slightly off after valid drop, uncomment below
                // const originalPos = $(this).data('originalPosition');
                // if (originalPos) {
                //     $(this).css({ top: originalPos.top + 'px', left: originalPos.left + 'px' });
                // }
                $(this).removeData('originalPosition'); // Clean up position data
            }
          });
          priceChange(); // Assumes priceChange() exists
        }
      } else {
        // Case 2: Dropped a cloned item (from within the cart) back onto the cart
        // *** Crucial: Set the flag ON THE ORIGINAL CLONE (ui.draggable) ***
        // This tells the stop() handler that this drop was valid.
        ui.draggable.data('droppedValidly', true);
      }
    }
  });

  // --- Body Droppable Setup (for removing items) ---
  $("body").droppable({
    accept: ".itemBox.cloned", // Only accept clones from the cart
    drop: function(event, ui) {
      const $cloneToRemove = ui.draggable;
      // *** Crucial: Set the flag ON THE ORIGINAL CLONE being removed ***
      // This tells its stop() handler that the drop was valid (onto the body).
      $cloneToRemove.data('droppedValidly', true);
      $cloneToRemove.remove(); // Remove the clone from the DOM immediately
      priceChange(); // Assumes priceChange() exists
    }
  });
}

// Example Usage (ensure priceChange is defined first):
// $(document).ready(function() {
//   window.priceChange = function() { /* calculate price */ console.log("Update price"); };
//   $(".modal .items .itemBox").each((i, el) => makeSourceItemDraggable(el));
//   setupDroppables();
// });
function category() {
  fetch("./product.json")
    .then((res) => res.json())
    .then((obj) => {
      const itemContainer = $(".modal .items");
      const categoryButtons = $(".cataegory div");

      function displayItems(categoryName) {
        itemContainer.empty();
        if (!obj.product || !obj.product[categoryName]) return;

        Object.keys(obj.product[categoryName]).forEach((key, idx) => {
          const itemData = obj.product[categoryName][key];
          const originalItemId = `cat-${categoryName}-item-${idx}`;

          const $newItem = $(`
            <div class="itemBox" data-id="${originalItemId}">
              <div class="drag">
                <div class="img-box">
                  <img src="/선수제공파일/A-Module/images/${categoryName}/${
            idx + 1
          }.PNG" alt="${categoryName}-${idx + 1}" />
                </div>
                <div class="text-content">
                  <div><p class="item-Name">${itemData.title}</p></div>
                  <div><p class="fa"> 가격 <span class="itemPrice">${
                    itemData.price
                  }</span></p></div>
                </div>
              </div>
            </div>
          `);

          itemContainer.append($newItem);
          makeSourceItemDraggable($newItem);
        });
      }

      categoryButtons.on("click", function () {
        displayItems($(this).text());
      });

      if (categoryButtons.length > 0) {
        displayItems($(categoryButtons[0]).text());
      }
    })
    .catch((error) => console.error("Error loading product data:", error));
}

$(document).ready(() => {
  unknowUser();
  videoCtrl();
  modal();
  setupDroppables();
  category();

  $(".drop").on("change input", ".itemCount", function () {
    priceChange();
  });
});
