class User {
  static register(e) {
    e.preventDefault();
    const registerData = $("#registerForm").serialize();
    $.ajax({
      type: "POST",
      url: `${baseURL}/register`,
      data: registerData,
      dataType: "json"
    })
      .done(newUser => {
        $("#registerContainer").hide(1000);
      })
      .fail(err => {
        console.log(err);
      });
  }

  static login(e) {
    e.preventDefault();
    const loginData = $("#loginForm").serialize();
    $.ajax({
      type: "POST",
      url: `${baseURL}/login`,
      data: loginData,
      dataType: "json"
    })
      .done(({ token }) => {
        localStorage.setItem("token", token);
        $("#loginAndRegister").hide(1000);
        $("#logoutButton").show(1000);
        Todo.getTasks();
      })
      .fail(err => {
        console.log(err);
      });
  }

  static googleLogin(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
      type: "POST",
      url: `${baseURL}/login/google`,
      data: {
        google_token: id_token
      }
    })
      .done(response => {
        localStorage.setItem("token", response.token);
        localStorage.setItem("login_way", "google");
        $("#loginAndRegister").hide(1000);
        $("#logoutButton").show(1000);
        Todo.getTasks();
      })
      .fail(err => {
        console.log(err);
      });
  }

  static logout(e) {
    e.preventDefault();
    $("#logoutButton").hide(1000);
    if (localStorage.login_way == "google") {
      User.googleLogout();
    } else {
      localStorage.clear();
      $("#app").empty();
      $(".userComponent").hide();
      $("#loginEmail").val(null);
      $("#loginPassword").val(null);
      $("#loginAndRegister").show(1000);
    }
  }

  static googleLogout() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log("User signed out.");
      localStorage.clear();
      $("#app").empty();
      $(".userComponent").hide();
      $(".userComponent").hide();
      $("#loginAndRegister").show(1000);
    });
  }
}

function googleSignIn(googleUser) {
  return User.googleLogin(googleUser);
}
