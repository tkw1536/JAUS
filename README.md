# JAUS - Yet Another Url Shortener (that starts with J)

JAUS is a really tiny URL shortener written in NodeJS + Express + MongoDB. It features:

* URL Shortening (duh)
* Forwarding directly and frame-embedding of forwarded pages
* Forwardings of the form "http://url.url?does this work?"
* Managing existing Forwardings
* User Management
* Limitation of number of links created on a per user-basis

## Install
```bash
# install dependencies
npm Install
bower Install

# Create configuration file
cp config.json.sample config.json
# edit config json with your favorite editor

# run it!
node index.js 
```

The go to [http://localhost:3000/!/!/](http://localhost:3000/!/!/) to see the admin panel. Default username/password is admin/admin. 

## License

JAUS is &copy; Tom Wiesing 2015 and licensed under MIT License. See [License](License) for full license text.
