function drag() {
  function restore(id) {
    $(`.items .itemBox[data-id="${id}"]`).css("opacity", 1).draggable("enable");
  }

  $(".items .itemBox").each((i, el) => {
    $(el)
      .attr("data-id", `orig-${i}`)
      .draggable({
        helper: "clone",
      });
  });

  $(".drop").droppable({
    accept: ".itemBox:not(.cloned)",
    drop(event, ui) {
      const $orig = ui.draggable;
      const id = $orig.data("id");

      const $clone = $orig
        .clone()
        .css({ position: "absolute", top: "", left: "", opacity: 1 })
        .removeClass("ui-draggable ui-draggable-handle")
        .addClass("cloned")
        .attr("data-id", id)
        .appendTo(this);

      $clone.draggable({
        start(e, item_ui) {
          // 위치 오류 수정
          const { top, left } = $(this).position();
          $(this).css({ position: "absolute", top: `${top}px`, left: `${left - 300}px` });
        },
        stop(e, item_ui) {
          if (!$(this).data("returned")) {
            restore($(this).data("id"));
            $(this).remove();
          }
        },
      });

      $orig.css("opacity", 0.3).draggable("disable");
      changeTotal(id);
    },
  });

  $("body").droppable({
    accept: ".cloned",
    drop(event, ui) {
      const $clone = ui.draggable;
      restore($clone.data("id"));
      changeTotal($clone.data("id"));
      $clone.data("returned", true).remove();
      $clone
    },
  });
}