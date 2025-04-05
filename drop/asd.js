function makeSourceItemDraggable(itemEl) {
  $(itemEl).draggable({
    helper: "clone",
    appendTo: "body",
    zIndex: 9999,
  });
}

function setupDroppables() {
  $(".drop").droppable({
    accept: ".itemBox",
    drop: function (event, ui) {
      const $dropped = ui.draggable;
      const id = $dropped.data("id");

      if (!$dropped.hasClass("cloned")) {
        const $existing = $(this).find(`.itemBox.cloned[data-id="${id}"]`);

        if ($existing.length) {
          const $input = $existing.find(".itemCount");
          $input.val((parseInt($input.val()) || 0) + 1);
        } else {
          const $clone = $dropped
            .clone()
            .css({ position: "relative", top: 0, left: 0, opacity: 1 })
            .removeClass(
              "ui-draggable ui-draggable-handle ui-draggable-dragging"
            )
            .addClass("cloned")
            .attr("data-id", id)
            .appendTo(this);

          $clone.find(".text-content").append(`
            <div style="margin-top: 5px;">
              <span>개수:</span> <input type="number" class="itemCount" value="1" min="1" style="width:50px;"/>
            </div>`);

          $clone.draggable({
            helper: "clone",
            appendTo: "body",
            zIndex: 9999,
            start: function () {
              $(this).data("valid-drop", false);
            },
            stop: function () {
              if (!$(this).data("valid-drop")) {
                $(this).remove();
              }
            },
          });
        }
      } else {
        $dropped.data("valid-drop", true);
      }
    },
  });

  $("body").droppable({
    accept: ".itemBox.cloned",
    drop: function (event, ui) {
      ui.draggable.data("valid-drop", true);

      ui.draggable.remove();
    },
  });
}

$(document).ready(function () {
  $(".modal .items .itemBox").each((i, el) => makeSourceItemDraggable(el));

  setupDroppables();
});
