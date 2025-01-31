@import url(https://fonts.googleapis.com/css?family=Shadows+Into+Light);

@-webkit-keyframes throb{
  0%{
    -webkit-transform: scale(1);
  }
  35%{
    -webkit-transform: scale(1.2);
  }
  85%{
    -webkit-transform: scale(1);
  }   
}

html {
  display: table;
  width: 100%;
  height: 100vmin;
  table-layout: fixed;
}

body {
  display: table-cell;
  vertical-align: middle;
  font-family: 'Shadows Into Light';
  color: #111;
}

.wrapper {
  width: 90vmin;
  height: 90vmin;
  position: relative;
  margin: 5vmin auto;
}

div.throb {
  -webkit-animation: throb 0.5s infinite;
  animation: throb 0.5s infinite;
  animation-delay: 0.8s;

}
input[type="checkbox"] {
  display: none;
}

input[type="checkbox"] + label {
  width: 30vmin; height: 30vmin;
  line-height: 30vmin;
  display: inline-block;
  position: absolute;
  font-size: 30vmin;
  text-align: center;
  transition: all 1s ease;
}

label {
  text-shadow: 3vmin 3vmin 10vmin rgba(0,0,0,0.5);
}
  label:hover {
    color: #c32a2a;
    cursor: pointer;
  }

#ck1 + label,
#ck2 + label {
  border-radius: 50%;
  top: 0;
}

#ck1:checked + label,
#ck2:checked + label,
#ck3:checked + label {
  background: #c32a2a;
  font-size: 0;
  transition: all 1s ease;
}

#ck1 + label {
  left: 0;
}

#ck2 + label {
  right: 10vmin;
}

#ck1:checked + label,
#ck2:checked + label {
  width: 54vmin; height: 54vmin;
  border-radius: 50%;
  line-height: 54vmin;
}

#ck2:checked + label {
  right: 0;
}

#ck3 + label {
  bottom: 5vmin; left: 50%;
  margin: 0 -9vmin;
  background-color: white;
}

#ck3:checked + label {
  width: 49.5vmin; height: 49.5vmin;
  bottom: 17.28vmin; left: 29.16vmin;
  transform: rotate(45deg);
  line-height: 4.86vmin;
}

span {
  display: inline-block;
  text-align: left;
  position: absolute;
  bottom: 0vmin; left: 0vmin;
  margin-bottom: -3vmin;
  font-size: 6vmin;
  color: #999;
}
