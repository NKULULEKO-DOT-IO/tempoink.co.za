var element = document.getElementById('instafeed');
var dataID = element.getAttribute('data-count');
var dataStyle = element.getAttribute('data-style');
var dataToken = element.getAttribute('data-accessToken');
let val = Number(dataID);

var feed = new Instafeed({
//  accessToken: 'IGQVJWSVNMS3RsT3hBQmpWbU0yQk4wSjVMQm1OZADhvbnk4NnRmNnhNZAi1PMHhNLTAxNlNvbmtWOHFBNEtCWUk3dmI0NmQtM3gzcy12OTNfTGRJRHBORU1hWGFhQl81bkl2TThJR2R3',
    accessToken: dataToken,
    limit: val,  
   success: function () {    
    instagramCall();
	},
  template: '<a href="{{link}}" class="'+dataStyle+'"><img title="{{caption}}" src="{{image}}" /></a>'
});
feed.run();