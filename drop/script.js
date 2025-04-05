function resotre(el) {
  $(el).draggable({
    helper: "clone",
    appendTo: "body",
    zIndex: 9999,
  });
}

function drag() {
  $(".drop").droppable({
    accept: ".itemBox",
    drop(event, ui) {
      const $orig = ui.draggable;
      const id = $orig.data("id");

      if (!$orig.hasClass("cloned")) {
        const $exiting = $(this).find(`.itemBox.cloned[data-id="${id}"]`);

        if ($exiting.length) {
          const $input = $exiting
        }
      }
    },
  });
}
