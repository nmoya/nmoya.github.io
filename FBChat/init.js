// My functions are here: 
list_of_threads = [];

function getAllThreads(request_url, callback) {
  FB.api(request_url, function(response) {
    global = response;
    console.log(request_url);
    console.log(response);
    for (var i = 0; i < response.data.length; i++) {
      var tmp = response.data[i]["to"].data.slice(1, response.data[i]["to"].data.length)
      var names = []
      for (var j = 0; j < tmp.length; j++) {
        if (tmp[j].name)
          names.push(tmp[j].name)
      }
      list_of_threads.push({
        "id": response.data[i].id,
        "to": names.join(", ")
      });
    }
    if (response.paging)
      getAllThreads(response.paging.next, callback)
    else {
      console.log("calling callback");
      callback();
    }

  });
}

function main() {
  var user_id = null;
  FB.api('/me', function(response) {
    console.log('Welcome!  Fetching your information.... ');
    user_id = response.id;
    user_name = response.name;
    console.log(user_id, user_name);
    getAllThreads("/" + user_id + '/inbox', function() {
      console.log("List of threads: ");
      var table = document.getElementById("threads_table");
      for (var i = 0; i < list_of_threads.length; i++) {
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = user_name;
        cell2.innerHTML = list_of_threads[i].to;
        cell3.innerHTML = list_of_threads[i].id;
      }
    });
  });
}