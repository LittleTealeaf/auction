# API Overview

## Authorization

First, the user needs to sign in. This sends the username/password to the login api endpoint. The return value of this becomes the authentication key that is used to sign in.

A user can only have one authentication key enabled at a time (everything else gets disabled). Authentication Keys are deleted when the user logs out.


