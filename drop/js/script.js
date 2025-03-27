let counter = 0;

function drag() {
  $(".redrop .drag").draggable({
    cursor: "move",
    helper: "clone",
    revert: "invalid",
  });

  $(" .drop").droppable({
    drop: function (event, ui) {
      const originalItem = ui.draggable;
      const dropTarget = $(this);

      const id = `id-${counter}`;
      var newClone = originalItem.clone();

      newClone.attr("id", id);
      originalItem.attr("id", id);

      console.log("Cloned item ID:", newClone.attr("id"));
      console.log("Original item ID:", originalItem.attr("id"));

      newClone.appendTo(dropTarget);
      originalItem.css("opacity", "0.5");
      originalItem.draggable("disable");
      counter++;

      $(".drop .drag").draggable({
        cursor: "move",
        helper: "clone",
        revert: "invalid",
      });

      $("body").droppable({
        drop: function (event, ui_return) {
          var returnedClone = ui_return.draggable;
          var cloneId = returnedClone.attr("id");

          console.log("Trying to return clone with ID:", cloneId);

          if (cloneId) {
            var originalToRemove = $('.redrop .drag[id="' + cloneId + '"]');

            if (originalToRemove.length > 0) {
              console.log(
                "Found original to remove:",
                originalToRemove.attr("id")
              );
              originalToRemove.remove();
            } else {
              console.warn(
                "Could not find original item in .redrop with ID:",
                cloneId
              );
            }
          } else {
            console.warn("Returned clone is missing an ID!");
          }

          returnedClone.appendTo($(".redrop"));
        },
      });
    },
  });
}

drag();
