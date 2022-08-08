chrome.tabs.query(
  { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
  function (tabs) {
    console.log(tabs[0].url);
    // Need to pass the url
    let currenturl = tabs[0].url;
    console.log(currenturl);

    // let vara = localStorage.getItem(username);
    // console.log(vara);

    $.ajax({
      url: "https://webapi.cloudlead.ai/extension/getdata",
      type: "GET",
      headers: {
        apiKey: "thisismysecret",
        email: "abhinaysharma.vw@gmail.com",
        linkedin_id: "http://www.linkedin.com/in/faisalazamkhan"
      },
      contentType: "application/json; charset=utf-8",
      success: function (result) {
        // CallBack(result);
        //  console.log(result);
        var res = JSON.parse(JSON.stringify(result));
        //    console.log(res);
        let data = JSON.parse(res.profile);

        var fullname = data.first_name + " " + data.last_name;
        var linkedin_id = data.organization.org_linkedin_url;
        var organization_name = data.organization.organization_name;
        var short_description = data.organization.short_description;
        var email = data.email;
        var country = data.country;
        var location = data.city;
        var direct_dial = data.direct_dial;
        var social_media_link = data.organization.facebook_url;
        var industry = data.organization.industry;
        var no_of_employees = data.organization.count;

        document.getElementById("fullname").innerHTML = fullname;
        document.getElementById("linkedin_id").innerHTML = linkedin_id;
        document.getElementById("organization_name").innerHTML =
          organization_name;
        document.getElementById("short_description").innerHTML =
          short_description;
        document.getElementById("email").innerHTML = email;
        document.getElementById("country").innerHTML = country;
        document.getElementById("location").innerHTML = location;
        document.getElementById("direct_dial").innerHTML = direct_dial;
        document.getElementById("social_media_link").innerHTML =
          social_media_link;
        document.getElementById("industry").innerHTML = industry;
        document.getElementById("no_of_employees").innerHTML = no_of_employees;
      },
      error: function (error) {
        console.log("error");
      }
    });
  }
);

let element1 = document.getElementById("logoutBtn");
console.log(element1);
if (element1) {
  element1.addEventListener("click", logout, true);
}

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("password");
  console.log("Done");
  window.location = "popup.html";
}
