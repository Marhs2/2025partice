$(document).ready(function () {
  const SCOPE = "items";

  function restoreOriginal(id) {
    $(`.redrop .drag[data-id="${id}"]`).css("opacity", 1).draggable("enable");
  }

  $(".redrop .drag").each((i, el) => {
    $(el).attr("data-id", `orig-${i}`).draggable({
      helper: "clone",
      scope: SCOPE,
    });
  });

  $(".drop").droppable({
    accept: ".drag:not(.cloned)",
    scope: SCOPE,
    drop: function (event, ui) {
      const $original = ui.draggable;
      const id = $original.data("id");

      const $clone = $original
        .clone()
        .css({ position: "", top: "", left: "", opacity: 1 })
        .removeClass("ui-draggable ui-draggable-handle ui-draggable-dragging")
        .addClass("cloned")
        .attr("data-id", id)
        .appendTo(this);

      $clone.draggable({
        scope: SCOPE,
        stop: function (e, item_ui) {
          if (!$(this).data("returned")) {
            restoreOriginal($(this).data("id"));
            $(this).remove();
          }
        },
      });

      $original.css("opacity", 0.3).draggable("disable");
    },
  });

  $(".redrop").droppable({
    accept: ".cloned",
    scope: SCOPE,
    drop: function (event, ui) {
      const $clone = ui.draggable;
      restoreOriginal($clone.data("id"));
      $clone.data("returned", true).remove();
    },
  });
});
