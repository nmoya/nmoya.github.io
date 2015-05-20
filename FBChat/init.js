var listOfConversations = [];
var listOfMessages = [];
var user_name = null;

function getAllConversations(request_url, user_name, callback)
{
  FB.api(request_url, function (response)
  {
    // console.log(response);
    if (response.error)
    {
      console.log(response.error.message);
      console.log("Waiting 60 seconds");
      setTimeout(function ()
      {
        console.log("Trying again");
        getAllConversations(request_url, user_name, callback)
      }, 60000);
    }
    else
    {
      for (var i = 0; i < response.data.length; i++)
      {
        if (response.data[i].to.data.length == 2)
        {
          if (response.data[i].to.data[1].name != user_name)
          {
            // console.log(response.data[i]);
            listOfConversations.push(new Conversation(response.data[i].id, user_name, response.data[i].to.data[1].name))
          }
        }
      }
      if (response.paging)
        getAllConversations(response.paging.next, user_name, callback)
      else
        callback();
    }
  });
}

function getAllMessages(request_url, callback)
{
  FB.api(request_url, function (response)
  {
    if (response.error)
    {
      console.log(response.error.message);
      console.log("Waiting 60 seconds to continue getting all messages");
      setTimeout(function ()
      {
        getAllMessages(request_url, callback)
      }, 60000);
    }
    else
    {
      if (!response.comments)
        callback();
      for (var i = 0; i < response.comments.data.length; i++)
      {
        listOfMessages.push(new Message(response.comments.data[i].id,
          response.comments.data[i].from.name,
          response.comments.data[i].message,
          response.comments.data[i].created_time));
      }
      if (response.comments.paging)
      {
        refreshHTML(response.comments.data.length);
        getAllMessagesPaging(response.comments.paging.next, callback);
      }
    }
  });
}

function getAllMessagesPaging(request_url, callback)
{
  FB.api(request_url, function (response)
  {
    if (response.error)
    {
      console.log(response.error.message);
      console.log("Waiting 60 seconds to continue getting all messages");
      setTimeout(function ()
      {
        getAllMessagesPaging(request_url, callback)
      }, 60000);
    }
    else
    {
      // console.log(response);
      for (var i = 0; i < response.data.length; i++)
      {
        listOfMessages.push(new Message(response.data[i].id,
          response.data[i].from.name,
          response.data[i].message,
          response.data[i].created_time));
      }
      if (response.paging)
      {
        refreshHTML(response.data.length);
        getAllMessagesPaging(response.paging.next, callback);
      }
      else
        callback();
    }
  });
}

function refreshHTML(increment)
{
  var counter = document.getElementById("progress").innerHTML;
  counter = parseInt(counter);
  counter += increment;
  document.getElementById("progress").innerHTML = counter;
}

function handlerGenerateButton()
{
  var select = document.getElementById("conversations");
  var conversationId = select[select.selectedIndex].value;
  var to = select[select.selectedIndex].innerHTML;

  var counter = document.getElementById("progress");
  var table = document.getElementById("messagesTable");
  table.innerHTML = "";
  counter.innerHTML = 0;

  // 185506144849518
  console.log("Starting");
  getAllMessages("/" + conversationId, computeStatistics);
}

function computeStatistics()
{
  console.log("callback called. computeStatistics");
  console.log("Number of messages: ");
  console.log(listOfMessages.length);
  generateTable();
}

function generateSelectOptions()
{
  var select = document.getElementById("conversations");
  for (var i = 0; i < listOfConversations.length; i++)
  {
    var option = document.createElement("option");
    option.value = listOfConversations[i].id;
    option.innerHTML = listOfConversations[i].to;
    select.appendChild(option);
  }
}

function generateTable()
{
  var table = document.getElementById("messagesTable");
  for (var i = 0; i < listOfMessages.length; i++)
  {
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = listOfMessages[i].from;
    cell2.innerHTML = listOfMessages[i].message;
    cell3.innerHTML = listOfMessages[i].datetime;
  }
}

function main()
{
  var user_id = null;
  document.getElementById("generateStats").addEventListener("click", handlerGenerateButton);
  FB.api('/me', function (response)
  {
    user_id = response.id;
    user_name = response.name;
    console.log(user_id, user_name);
    // alert("uncomment me");
    getAllConversations("/" + user_id + '/inbox', user_name, generateSelectOptions);
  });
}