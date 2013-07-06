function ViewModel() {
	var self = this;

	self.searchResults = ko.observableArray([]);
}

function SearchResultViewModel() {
	var self = this;

	self.url = ko.observable();
	self.title = ko.observable();
	self.preview = ko.observable();
	self.rank = ko.observable();
}

var viewModel = new ViewModel();

ko.applyBindings(viewModel);

$(document).ajaxSuccess(function (event, jqXHR, settings) {
	$("#error").hide();
});

$(document).ajaxError(function (event, jqXHR, settings, exception) {
	$("#error").show();
	$("#errorMessage").html("<strong>Oops!</strong> " + jqXHR.statusText);
});

function onSearchSuccess(data, textStatus, jqXHR) {
	viewModel.searchResults.removeAll();

	if (data) {
		for (var i = 0; i < data.length; i++) {
			var result = new SearchResultViewModel();
			result.url(data[i].Url);
			result.title(data[i].Title);
			result.preview(data[i].Preview);

			viewModel.searchResults.push(result);
		}
	}
}

$("#searchTerms").typeahead({
	source: function (query, process) {
		var data = {
			searchType: $("#searchType").val(),
			searchTerms: query
		};
		$.ajax({
			url: "/home/suggest",
			dataType: "json",
			data: data,
			type: "POST"
		}).done(function (data, textStatus, jqXHR) {
			process(data);
		});
	}
});