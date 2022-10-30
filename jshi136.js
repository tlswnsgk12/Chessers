function openPage(pageName, elmnt, color) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "block";
}

document.getElementById("defaultOpen").click();

window.onload = (event) => {
  localStorage.removeItem("firstmove");
  localStorage.removeItem("mymove");
  localStorage.removeItem("secondmove1");
  localStorage.removeItem("secondmove2");
  localStorage.removeItem("gameid");
  localStorage.removeItem("spw");
  localStorage.setItem("sqw", 1);
  localStorage.removeItem("spb");
  localStorage.setItem("sqb", 1);
  savedlogin();
};

function register() {
  const userid = document.getElementById("useridregister").value;
  const pswd = document.getElementById("pswdregister").value;
  const address = document.getElementById("addrregister").value;
  const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/Register", {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    method: "POST",
    body: JSON.stringify({
      username: userid,
      password: pswd,
      address: address,
    }),
  });
  const streamPromise = fetchPromise.then((response) => response.text());
  streamPromise.then((data) => {
    if (data.search("registered") > 0) {
      document.getElementById("useridregister").value = "";
      document.getElementById("pswdregister").value = "";
      document.getElementById("addrregister").value = "";
      document.getElementById("UserRegistration").style.display = "none";
      document.getElementById("UserLogin").style.display = "block";
      alert(data + ". Redirect to Log In page.");
    } else {
      alert(userid + ": " + data);
      document.getElementById("useridregister").value = "";
      document.getElementById("pswdregister").value = "";
      document.getElementById("addrregister").value = "";
    }
  });
}

function getid() {
  document.getElementById("showingid").innerText =
    "Hi, " + localStorage.getItem("id");
}

function login() {
  const userid = document.getElementById("useridlogin").value;
  const pswd = document.getElementById("pswdlogin").value;
  const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/VersionA", {
    headers: {
      Authorization: "Basic " + btoa(`${userid}:${pswd}`),
    },
    method: "GET",
  });
  const streamPromise = fetchPromise.then((response) => response.status);
  streamPromise.then((data) => {
    if (data == 200) {
      localStorage.setItem("id", userid);
      localStorage.setItem("pw", pswd);
      getid();
      document.getElementById("useridlogin").value = "";
      document.getElementById("pswdlogin").value = "";
      document.getElementById("UserLogin").style.display = "none";
      document.getElementById("Home").style.display = "block";
      document.getElementById("loginbutton").style.display = "none";
      document.getElementById("logoutbutton").style.display = "block";
      alert("Login suceed. Redirect to Homepage.");
    } else {
      alert("Invalid ID or Password");
      document.getElementById("useridlogin").value = "";
      document.getElementById("pswdlogin").value = "";
    }
  });
}

function savedlogin() {
  const userid = localStorage.getItem("id");
  if (userid != null) {
    getid();
    document.getElementById("loginbutton").style.display = "none";
    document.getElementById("logoutbutton").style.display = "block";
  }
}

function logout() {
  localStorage.removeItem("id");
  localStorage.removeItem("pw");
  document.getElementById("loginbutton").style.display = "block";
  document.getElementById("logoutbutton").style.display = "none";
  alert("Loggedout sucessfully. Redirect to Homepage.");
  document.getElementById("Home").style.display = "block";
}

function writecomment() {
  const comment = document.getElementById("comment").value;
  if (comment == "") {
    document.getElementById("comment").value = "";
    document.getElementById("commentname").value = "";
    alert("Empty Comment.");
  } else {
    const name = document.getElementById("commentname").value;
    const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/Comment", {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      method: "POST",
      body: JSON.stringify({
        comment: comment,
        name: name,
      }),
    });
    document.getElementById("comment").value = "";
    document.getElementById("commentname").value = "";
    alert("Comment Successfully uploaded.");
    document.getElementById("coms").src =
      "https://cws.auckland.ac.nz/gas/api/Comments";
  }
}

async function getitems() {
  const getDetails = async () => {
    const response = await fetch(
      "https://cws.auckland.ac.nz/gas/api/AllItems",
      {
        headers: {
          Accept: "application/json",
        },
        method: "GET",
      }
    );
    const data = await response.json();
    showDetails(data);
  };

  const showDetails = (orders) => {
    let htmlString = "";

    const showOrder = (order) => {
      htmlString += `<tr class="product">
      <td>
        <table>
          <tr>
            <img
              class="productimg"
              src="https://cws.auckland.ac.nz/gas/api/ItemPhoto/${order.id}"
              width="300px"
              height="300px"
              class="productimg"
            />
          </tr>
          <br />
          <tr>
            <p class="productname">${order.name}</p>
          </tr>
          <br />
          <tr>
            ${order.description}
          </tr>
          <tr>
            <p class="productprice">$${order.price}</p>
          </tr>
          <tr>
            <button class="purchasebut" onclick="purchase(${order.id})">
              Purchase
            </button>
          </tr>
        </table>
      </td>
    </tr>`;
    };
    orders.forEach(showOrder);
    const table = document.getElementById("nwTab");
    table.innerHTML = htmlString;
  };
  getDetails();
}

function searchproducts() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("productsearch");
  filter = input.value.toUpperCase();
  table = document.getElementById("nwTab");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("p")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function purchase(productid) {
  const userid = localStorage.getItem("id");
  const pswd = localStorage.getItem("pw");
  if (userid == null) {
    document.getElementById("AcademyShop").style.display = "none";
    document.getElementById("UserLogin").style.display = "block";
  } else {
    const fetchPromise = fetch(
      "https://cws.auckland.ac.nz/gas/api/PurchaseItem/" + productid,
      {
        headers: {
          Authorization: "Basic " + btoa(`${userid}:${pswd}`),
        },
        method: "GET",
      }
    );
    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => {
      alert(
        "Thank you, " +
          userid +
          ". Item " +
          productid +
          " successfully purchased."
      );
    });
  }
}

function pairme() {
  localStorage.removeItem("gameid");
  const userid = localStorage.getItem("id");
  const pswd = localStorage.getItem("pw");
  if (userid == null) {
    document.getElementById("GameOfChess").style.display = "none";
    document.getElementById("UserLogin").style.display = "block";
  } else {
    const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/PairMe", {
      headers: {
        Authorization: "Basic " + btoa(`${userid}:${pswd}`),
      },
      method: "GET",
    });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => {
      if (data.state == "progress") {
        localStorage.setItem("gameid", data.gameId);
        if (data.player1 == userid) {
          document.getElementById("status").innerText =
            "Great " +
            userid +
            ", you are playing with " +
            data.player2 +
            ". Your pieces are WHITE. GOOD LUCK!";
          document.getElementById("button1").setAttribute("hidden", "hidden");
          document.getElementById("button2").removeAttribute("hidden");
        } else {
          document.getElementById("status").innerText =
            "Great " +
            userid +
            ", you are playing with " +
            data.player1 +
            ". Your pieces are BLACK. GOOD LUCK!";
          document.getElementById("button1").setAttribute("hidden", "hidden");
          document.getElementById("button3").removeAttribute("hidden");
        }
      } else {
        document.getElementById("status").innerText =
          "Wait for another player to join. Press 'Join Me' intermittently to see if someone paired up with you. Please DO NOT spam.";
      }
    });
  }
}

function mymove() {
  const userid = localStorage.getItem("id");
  const pswd = localStorage.getItem("pw");
  const game = localStorage.getItem("gameid");
  const move1 = localStorage.getItem("firstmove");
  const move2 = localStorage.getItem("mymove");
  const move3 = localStorage.getItem("secondmove1");
  const move4 = localStorage.getItem("secondmove2");
  if (userid == null) {
    document.getElementById("GameOfChess").style.display = "none";
    document.getElementById("UserLogin").style.display = "block";
  } else {
    const fetchPromise = fetch("https://cws.auckland.ac.nz/gas/api/MyMove", {
      headers: {
        Authorization: "Basic " + btoa(`${userid}:${pswd}`),
        "Content-Type": "application/json; charset=UTF-8",
      },
      method: "POST",
      body: JSON.stringify({
        gameId: game,
        move: move1 + "-" + move2 + ":" + move3 + "-" + move4,
      }),
    });
    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => {
      if (data.search("no") == -1) {
        if (move1 != null && move2 != null) {
          alert(data);
          document.getElementById("button2").setAttribute("hidden", "hidden");
          document.getElementById("button3").removeAttribute("hidden");
        } else {
          alert("Move any piece.");
        }
      } else {
        alert("Game has ended by opponent. Redirecting to Homepage.");
        localStorage.removeItem("gameid");
        window.location.reload();
      }
    });
  }
}

function theirmove() {
  const userid = localStorage.getItem("id");
  const pswd = localStorage.getItem("pw");
  const game = localStorage.getItem("gameid");
  if (userid == null) {
    document.getElementById("GameOfChess").style.display = "none";
    document.getElementById("UserLogin").style.display = "block";
  } else {
    const fetchPromise = fetch(
      "https://cws.auckland.ac.nz/gas/api/TheirMove?" + "gameId=" + game,
      {
        headers: {
          Authorization: "Basic " + btoa(`${userid}:${pswd}`),
        },
        method: "GET",
      }
    );
    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => {
      if (data.search("no") == -1) {
        if (data != "") {
          const fullmoves = data.split(":");
          const moves = fullmoves[0].split("-");
          const moves2 = fullmoves[1].split("-");
          document
            .getElementById(moves[1])
            .appendChild(
              document.getElementById(moves[0]).getElementsByTagName("img")[0]
            );
          if (document.getElementById(moves[1]).childElementCount >= 2) {
            document
              .getElementById(moves[1])
              .removeChild(
                document.getElementById(moves[1]).getElementsByTagName("img")[0]
              );
          }
          let w = parseInt(localStorage.getItem("sqw"));
          let b = parseInt(localStorage.getItem("sqb"));
          if (
            document
              .getElementById(moves[1])
              .getElementsByTagName("img")[0]
              .id.search("pw") > -1 &&
            moves[1].search("1") > -1 &&
            w < 5
          ) {
            document
              .getElementById(moves[1])
              .appendChild(document.getElementById("sqw" + w));
            document
              .getElementById(moves[1])
              .removeChild(
                document.getElementById(moves[1]).getElementsByTagName("img")[0]
              );
            localStorage.removeItem("sqw");
            localStorage.setItem("sqw", w + 1);
          } else if (
            document
              .getElementById(moves[1])
              .getElementsByTagName("img")[0]
              .id.search("pb") > -1 &&
            moves[1].search("8") > -1 &&
            b < 5
          ) {
            document
              .getElementById(moves[1])
              .appendChild(document.getElementById("sqb" + b));
            document
              .getElementById(moves[1])
              .removeChild(
                document.getElementById(moves[1]).getElementsByTagName("img")[0]
              );
            localStorage.removeItem("sqb");
            localStorage.setItem("sqb", b + 1);
          }
          if (moves2[0] != "null" && moves2[1] != "null") {
            document
              .getElementById(moves2[1])
              .appendChild(
                document
                  .getElementById(moves2[0])
                  .getElementsByTagName("img")[0]
              );
            if (document.getElementById(moves2[1]).childElementCount >= 2) {
              document
                .getElementById(moves2[1])
                .removeChild(
                  document
                    .getElementById(moves2[1])
                    .getElementsByTagName("img")[0]
                );
            }
          }
          localStorage.removeItem("firstmove");
          localStorage.removeItem("mymove");
          localStorage.removeItem("secondmove1");
          localStorage.removeItem("secondmove2");
          document.getElementById("button3").setAttribute("hidden", "hidden");
          document.getElementById("button2").removeAttribute("hidden");
        }
      } else {
        alert("Game has ended by opponent. Redirecting to Homepage.");
        localStorage.removeItem("gameid");
        window.location.reload();
      }
    });
  }
}

function quitgame() {
  const userid = localStorage.getItem("id");
  const pswd = localStorage.getItem("pw");
  const game = localStorage.getItem("gameid");
  if (userid == null) {
    document.getElementById("GameOfChess").style.display = "none";
    document.getElementById("UserLogin").style.display = "block";
  } else if (game == null) {
    alert("Start the game to quit game.");
  } else {
    const fetchPromise = fetch(
      "https://cws.auckland.ac.nz/gas/api/QuitGame?gameId=" + game,
      {
        headers: {
          Authorization: "Basic " + btoa(`${userid}:${pswd}`),
        },
        method: "GET",
      }
    );
    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => {
      alert("Game has ended. Redirecting to Homepage.");
      localStorage.removeItem("gameid");
      window.location.reload();
    });
  }
}

const mydragstart = (ev) => {
  ev.dataTransfer.setData("text/plain", ev.target.parentElement.id);
};
const mydragover = (ev) => {
  ev.preventDefault();
};
const mydrop = (ev) => {
  if (ev.dataTransfer != null) {
    const data = ev.dataTransfer.getData("text/plain");
    const source = document.getElementById(data).getElementsByTagName("img")[0];
    if (ev.target.id != "greycell" && ev.target.id.search("castling") <= -1) {
      if (ev.target.parentElement.id != "greycell") {
        if (ev.target.tagName != "IMG") {
          if (
            source.className == "white_piece" &&
            ev.target.getElementsByTagName("img")[0] != null &&
            ev.target.getElementsByTagName("img")[0].className == "white_piece"
          ) {
            alert("Wrong move");
          } else if (
            source.className == "black_piece" &&
            ev.target.getElementsByTagName("img")[0] != null &&
            ev.target.getElementsByTagName("img")[0].className == "black_piece"
          ) {
            alert("Wrong move");
          } else {
            ev.target.appendChild(source);
            const move = ev.target.id;
            const previd = ev.target.id;
            if (data == ev.target.id) {
              alert("Move any piece.");
            } else {
              if (localStorage.getItem("mymove") == null) {
                localStorage.setItem("firstmove", data);
              }
              if (localStorage.getItem("secondmove1") != null) {
                localStorage.removeItem("secondmove2");
                localStorage.setItem("secondmove2", move);
              } else {
                localStorage.removeItem("mymove");
                localStorage.setItem("mymove", move);
              }
              if (ev.target.childElementCount >= 2) {
                ev.target.removeChild(ev.target.getElementsByTagName("img")[0]);
              }
              if (
                source.id.search("pw") > -1 &&
                ev.target.id.search("1") > -1
              ) {
                let num = parseInt(localStorage.getItem("sqw"));
                if (num < 5) {
                  document
                    .getElementById(previd)
                    .appendChild(document.getElementById("sqw" + num));
                  document
                    .getElementById(previd)
                    .removeChild(
                      document
                        .getElementById(previd)
                        .getElementsByTagName("img")[0]
                    );
                  localStorage.removeItem("sqw");
                  localStorage.setItem("sqw", num + 1);
                }
              } else if (
                source.id.search("pb") > -1 &&
                ev.target.id.search("8") > -1
              ) {
                let num = parseInt(localStorage.getItem("sqb"));
                if (num < 5) {
                  document
                    .getElementById(previd)
                    .appendChild(document.getElementById("sqb" + num));
                  document
                    .getElementById(previd)
                    .removeChild(
                      document
                        .getElementById(previd)
                        .getElementsByTagName("img")[0]
                    );
                  localStorage.removeItem("sqb");
                  localStorage.setItem("sqb", num + 1);
                }
              }
            }
          }
        } else {
          if (
            source.className == "white_piece" &&
            ev.target.className == "white_piece"
          ) {
            alert("Wrong move");
          } else if (
            source.className == "black_piece" &&
            ev.target.className == "black_piece"
          ) {
            alert("Wrong move");
          } else {
            ev.target.parentNode.appendChild(source);
            const move = ev.target.parentNode.id;
            const previd = ev.target.parentNode.id;
            if (data == ev.target.parentNode.id) {
              alert("Move any piece.");
            } else {
              if (localStorage.getItem("mymove") == null) {
                localStorage.setItem("firstmove", data);
              }
              localStorage.removeItem("mymove");
              localStorage.setItem("mymove", move);
              if (ev.target.parentNode.childElementCount >= 2) {
                ev.target.parentNode.removeChild(
                  ev.target.parentNode.getElementsByTagName("img")[0]
                );
              }
              if (source.id.search("pw") > -1 && previd.search("1") > -1) {
                let num = parseInt(localStorage.getItem("sqw"));
                if (num < 5) {
                  document
                    .getElementById(previd)
                    .appendChild(document.getElementById("sqw" + num));
                  document
                    .getElementById(previd)
                    .removeChild(
                      document
                        .getElementById(previd)
                        .getElementsByTagName("img")[0]
                    );
                  localStorage.removeItem("sqw");
                  localStorage.setItem("sqw", num + 1);
                }
              } else if (
                source.id.search("pb") > -1 &&
                previd.search("8") > -1
              ) {
                let num = parseInt(localStorage.getItem("sqb"));
                if (num < 5) {
                  console.log(num);
                  document
                    .getElementById(previd)
                    .appendChild(document.getElementById("sqb" + num));
                  document
                    .getElementById(previd)
                    .removeChild(
                      document
                        .getElementById(previd)
                        .getElementsByTagName("img")[0]
                    );
                  localStorage.removeItem("sqb");
                  localStorage.setItem("sqb", num + 1);
                }
              }
            }
          }
        }
      } else {
        alert("Wrong move");
      }
    } else if (ev.target.id.search("castling") > -1) {
      ev.target.appendChild(source);
      localStorage.setItem("secondmove1", data);
    } else {
      alert("Wrong move");
    }
  }
};
