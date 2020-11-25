if ($(window).width() > 600) {
  $(".toast").toast("show");
} else {
  $(".toast").toast("hide");
}

ScrollReveal().reveal(".reveal1");
ScrollReveal().reveal(".reveal2", {
  delay: 500,
});

$(document).ready(function () {
  // Add smooth scrolling to all links
  $("a").on("click", function (event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top,
        },
        800,
        function () {
          // Add hash (#) to URL when done scrolling (default click behavior)
          window.location.hash = hash;
        }
      );
    } // End if
  });
});

$(document).ready(function () {
  $("#btnLogin").click(() => {
    location.href = "auth/login";
  });
  // $("#btnLogout").click(() => {
  //   location.href = "auth/logout";
  // });
  $("#menubtn").click(() => {
    location.href = "menu";
  });
  $("#bookingbtn").click(() => {
    location.href = "reservasi";
  });
  $("#locationbtn").click(() => {
    location.href = "lokasi";
  });
  $("#galeribtn").click(() => {
    location.href = "gallery";
  });
  $("#kontakbtn").click(() => {
    location.href = "kontak";
  });
  $("#register").click(() => {
    localtion.href = "auth/login";
  });
  $("#cekLogin").click(() => {
    uName = $("#exampleInputEmail1").val();
    uPw = $("#exampleInputPassword1").val();
    if (uName == "admin" && uPw == "admin") {
      location.href = "admin";
    } else {
      location.href = "/";
    }
  });
  $("table").on("click", "#acc", function () {
    if (confirm("Konfirmasi Reservasi ?")) {
      $(this).closest("tr").remove();
      alert("Berhasil Mengonfirmasi");
    }
  });
  $("table").on("click", "#reject", function () {
    $("#ModalTolak").modal("toggle");
    $("#btnTolak").click(() => {
      $("#ModalTolak").modal("hide");
      $(this).closest("tr").remove();
    });
  });
  // $("table").on("click", "#reject1", function () {
  //   if (confirm("Hapus Pesan ?")) {
  //     $(this).closest("tr").remove();
  //   }else{

  //   }
  // });
  $(".close").on("click", () => {});
});

const makanan = "makanan";
const minuman = "minuman";
const penutup = "penutup";
const mexp = new RegExp(makanan, "i");
const dexp = new RegExp(minuman, "i");
const pexp = new RegExp(penutup, "i");

$.getJSON("./data/menu.json", function (data) {
  let barisMakan = "";
  let barisMinum = "";
  let barisPenutup = "";

  $.each(data, function (key, val) {
    if (val.nama.search(mexp) != -1) {
      barisMakan += '<div class="col-sm">';
      barisMakan += `<img src="img/menus/${val.gambar}.jpg" alt="" class="gambar-menu"></img>`;
      barisMakan += `<figcaption class="h3">${val.nama}</figcaption>`;
      barisMakan += `<figcaption class="deskripsi-menu">${val.deskripsi}</figcaption>`;
      barisMakan += `</div>`;
    } else if (val.nama.search(dexp) != -1) {
      barisMinum += '<div class="col-sm">';
      barisMinum += `<img src="img/menus/${val.gambar}.jpg" alt="" class="gambar-menu"></img>`;
      barisMinum += `<figcaption class="h3">${val.nama}</figcaption>`;
      barisMinum += `<figcaption class="deskripsi-menu">${val.deskripsi}</figcaption>`;
      barisMinum += `</div>`;
    } else if (val.nama.search(pexp) != -1) {
      barisPenutup += '<div class="col-sm">';
      barisPenutup += `<img src="img/menus/${val.gambar}.jpg" alt="" class="gambar-menu"></img>`;
      barisPenutup += `<figcaption class="h3">${val.nama}</figcaption>`;
      barisPenutup += `<figcaption class="deskripsi-menu">${val.deskripsi}</figcaption>`;
      barisPenutup += `</div>`;
    }
  });

  $(".foutput").html(barisMakan);
  $(".doutput").html(barisMinum);
  $(".poutput").html(barisPenutup);
});

// $.getJSON("./data/gallery.json", function (data) {
//   let baris = "";

//   $.each(data, function (key, val) {
//     baris += '<div class="col-sm-4 col-md-4">';
//     baris += `<a class="lightbox" href="img/${val.gambar}">`;
//     baris += `<img class="galleryImg" src="img/${val.gambar}">`;
//     baris += "</a>";
//     baris += "</div>";
//   });

//   $(".galleryCafe").html(baris);
// });

let imgArray = [
  "cafeinterior1.jpg",
  "cafeinterior2.jpg",
  "cafeatmosphere.jpeg",
  "menu/dessert1.jpg",
  "menu/dessert2.jpg",
  "menu/drink1.jpg",
  "menu/drink2.jpg",
  "menu/food1.jpg",
  "menu/food2.jpg",
  "menu/Iced Lemonade.jpg",
];

for (i = 0; i < imgArray.length; i++) {
  let node = document.createElement("div");
  $(node).addClass("col-sm-4 col-md-4");
  let nodeLink = document.createElement("a");
  $(nodeLink).addClass("lightbox");
  nodeLink.href = `img/${imgArray[i]}`;
  let imageNode = document.createElement("img");
  $(imageNode).addClass("galleryImg");
  imageNode.src = `img/${imgArray[i]}`;
  nodeLink.appendChild(imageNode);
  node.appendChild(nodeLink);
  $(".galleryCafe").append(node);
}
