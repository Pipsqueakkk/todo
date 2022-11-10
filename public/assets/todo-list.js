$(document).ready(function () {
  $("form").on("submit", function () {
    var item = $("form input");
    var todo = { item: item.val() };

    $.ajax({
      type: "POST",
      url: "/todo",
      data: todo,
      success: function (data) {
        //do something with the data via front-end framework
        location.reload();
      },
    });

    return false;
  });

  $("li").click(function () {
    console.log("click on li");
    const id = $(this).attr("id");

    $.ajax({
      type: "DELETE",
      url: "/todo/" + id,
      success: function () {
        location.reload();
      },
    });

    console.log(`id: ${id}`);
  });

  // $("li").on("click", function () {
  //   var item = $(this).text().replace(/ /g, "-");
  //   $.ajax({
  //     type: "DELETE",
  //     url: "/todo/" + item,
  //     success: function (data) {
  //       //do something with the data via front-end framework
  //       location.reload();
  //     },
  //   });
  // });
});
