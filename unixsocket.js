var fs = require('fs'),
	exec = require('child_process').exec,
	execSync = require("child_process").execSync;

module.exports = {
	isStreamOpen: function(path, callback) {
		var st = "netstat --protocol=unix -nlp | grep unix | grep \"" + path + "\"";
		if (callback) {
			exec(st, function(error, stdout, stderr) {
				if (stdout != null) return callback(stdout.indexOf(path) != -1);
				return callback(false);
			});
		} else {
			var stdout = execSync(st);
			if (stdout != null) return (stdout.indexOf(path) != -1);
			return false;
		}
	},
	prepareStream: function(path, callback)	{
		if (callback) {
			this.isStreamOpen(path, function(using) {
				if (using) return callback(false);
				fs.exists(path, function(exists) {
					if (exists) {
						fs.unlink(path, function(err) {
							if (err) {
								console.error(err);
								return callback(false);
							}
							callback(true);
						});
					} else {
						callback(true);
					}
				});
			});
		} else {
			if (this.isStreamOpen(path)) return callback(false);
			if (fs.existsSync(path)) {
				if (fs.unlinkSync(path) == false) return callback(false);
			}
			return true;
		}
	},
	availableStream: function(paths, callback) {
		var st = "netstat --protocol=unix -nlp | grep unix";
		if (callback) {
			exec(st, function(error, stdout, stderr) {
				if (stdout == null) return callback(null);
				for (var i = 0; i < paths.length; i++) {
					if (stdout.indexOf(paths[i]) == -1) return callback(paths[i]);
				}
				return callback(null);
			});
		} else {
			var stdout = execSync(st);
			for (var i = 0; i < paths.length; i++) {
				if (stdout.indexOf(paths[i]) == -1) return paths[i];
			}
			return null;
		}
	},
	listen: function(server, option, callback) {
		if (typeof option == "string") option = { path: option, mode: null };
		if (Array.isArray(option)) option = { path: this.availableStream(option), mode: null };
		if (Array.isArray(option.path)) {
			option.path = this.availableStream(option.path);
			if (option.path == null) console.error("No available stream");
		}
		if (!callback) callback = function(result) {};

		if (option.path == null) return callback(null);

		this.prepareStream(option.path, function(result) {
			if (result == false) return callback(null);
			server.listen(option.path, function() {
				if (option.mode) {
					fs.chmod(option.path, option.mode, function(err) {
						if (err) console.error(err);
						callback(option.path);
					});
				} else {
					callback(option.path);
				}
			});
		});
	}
};
