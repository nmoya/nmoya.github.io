//This file needs to be loaded after jquery
$(function() {
	function get_last_url_segment(url) {
		return url.substr(url.lastIndexOf('/') + 1);
	}
	$("header").load("header.html", function() {
		$("footer").load("footer.html", function() {
			arr = $(".navigation-menu a");
			page = get_last_url_segment(document.URL);
			if (page == '')
				page = "index.html";
			for (i = 0; i < arr.length; i++) {
				if (page == get_last_url_segment(arr[i].href)) {
					arr[i].classList.add("active-link");
					break;
				}
			}
		});
	});

});