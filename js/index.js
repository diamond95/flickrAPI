$('#Search').on("click", function () {
	if ($('#tag').is(':checked')) {
		search_key = "&tags=";
		ajaxCall();
	} else {
		search_key = "&text=";
		ajaxCall();
	}
});

$("#tag, #title").on("change",function() {
    if (this.value == 1 || this.value == 2) {
		$('#gallery').fadeOut(500, function () {
			$(this).empty();
		});
    }
});

$("#input_search").on("keydown", function () {
	$('#gallery').fadeOut(500, function () {
		$(this).empty();
	});
});

function ajaxCall() {

	var searchText = $("#input_search").val();
	var API_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=e73c3c2e11d5780e5370d864dccff2cf&';
	var tags_text = search_key + searchText;
	var safe = "&safe_search=1";
	var extras = "&extras=owner_name,tags";
	var tagmode = "&tagmode=any";
	var jsonFormat = "&format=json";
	var finalURL = API_URL + "per_page=" + per_page + "&page=" + current_page + tags_text + safe + extras + tagmode + jsonFormat;


	$.ajax({
		url: finalURL,
		dataType: "jsonp",
		jsonp: "jsoncallback",
		success: function (data) {
			if (data.stat != "fail") {
				var result = "<table border='1' id='table'><tbody>";
				$.each(data.photos.photo, function (i, photo) {
					result += "<tr><td class='max'><p>";
					result += "<img class='modify' src='";
					result += "http://farm" + photo.farm + ".static.flickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_z.jpg'>";
					result += "<center><p><div class='shorter'><a href=\"" + "https://www.flickr.com/photos/" + photo.owner + "/" + photo.id + "\" target='_blank'>" + photo.title + "</a></p>";
					result += "<p>by <a href=\"" + "https://www.flickr.com/people/" + photo.owner + "\" target='_blank'>" + photo.ownername + "</a></p>";
					result += "<center><p><font color='blue'>Tags:</font> <div class='shorter'>" + photo.tags + "</div></p></center>";
					result += "</td></tr>";
				});
				
				result += "</tbody></table>";
				$("#gallery").append(result).fadeIn(200);

				var td = $("#table td");
				td.each(function (i) {
					if (i % 4 === 0) {
						td.slice(i, i + 4).wrapAll('<tr/>');
					}
				}).parent('tr').unwrap();

			} else {
				$("#gallery").empty();
				result = "<font color='red' size='3'>Please enter some tag/title.</font>";
				$("#gallery").append(result).fadeIn(200);
				setTimeout(function () {
					result = "";
					$("#gallery").append(result).fadeOut(200);
				}, 4000);
			}
		}
	});
}

var per_page = 10;
var current_page = 1;

$(document).ready(function () {
	$(window).scroll(function () {
		if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
			current_page++;
			ajaxCall();
		}
	});
});