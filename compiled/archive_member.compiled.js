"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Custom profiles or wanting to use custom HTML:
 * 	<div id="archived-member-profile-custom"></div>
 */

var Archive_Member = function () {
	function Archive_Member() {
		_classCallCheck(this, Archive_Member);
	}

	_createClass(Archive_Member, null, [{
		key: "init",
		value: function init() {
			this.PLUGIN_ID = "pd_archive_member";
			this.PLUGIN_KEY = "pd_archived_member";

			this.settings = {};
			this.archived = [];
			this.images = {};

			this.route = pb.data("route").name;

			this.setup();

			if (this.archived.length == 0) {
				return;
			}

			$(this.ready.bind(this));
		}
	}, {
		key: "ready",
		value: function ready() {
			var route = this.route;

			var mini_profile_check = route == "search_results" || route == "conversation" || route == "list_messages" || route == "thread" || route == "list_posts" || route == "permalink" || route == "all_recent_posts" || route == "recent_posts" || route == "posts_by_ip";

			if (this.settings.mini_profile && mini_profile_check) {
				Archive_Member_Mini_Profiles.init();
			} else if (route == "home" || route == "forum") {
				this.calculate_total_members();
			} else if (this.settings.members_page && (route == "members" || route == "list_members")) {
				Archive_Member_Members.init();
			} else if (this.settings.profile_page) {
				var profile_check = route == "user" || route == "show_user_activity" || route == "show_user_following" || route == "show_user_friends" || route == "show_user_groups" || route == "show_user_gift" || route == "edit_user_avatar" || route == "edit_user_personal" || route == "edit_user_social" || route == "edit_user_admin" || route == "show_user_notifications";

				if (profile_check) {
					new Archive_Member_Profile();
				}
			}
		}
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(this.PLUGIN_ID);

			if (plugin && plugin.settings) {
				this.settings = plugin.settings;

				this.settings.members_page = this.settings.members_page == 1 ? true : false;
				this.settings.profile_page = this.settings.profile_page == 1 ? true : false;
				this.settings.mini_profile = this.settings.mini_profile == 1 ? true : false;
				this.settings.message_post = this.settings.include_message_post == 1 ? true : false;
				this.archived = typeof this.settings.archived != "undefined" ? this.settings.archived : [];
			}
		}

		// Little long winded way of doing this.
		// Reason is that we need to be careful of names and
		// topic titles that might try to match what we are looking
		// for on purpose.  So we grab all TD elements and find the
		// one that just contains a matching text node.

		// If using custom template for this area, look for the element
		// wrapping around the count.
		// <span class="archive-member-total-members">$[total_members]</span>

	}, {
		key: "calculate_total_members",
		value: function calculate_total_members() {
			var _this = this;

			var $count = $(".archive-member-total-members");

			if ($count.length) {
				var total = parseInt($count.text().replace(/\D+/g, ""), 10);

				total -= this.archived.length;

				if (total < 0) {
					total = 0;
				}

				$count.text(this.number_format(total));
			} else {
				var $td = $(".stats td");

				$td.each(function (index, elem) {
					var $el = $(elem);

					if ($el.text().match(/^Total Members: ([\d\,\.]+)$/)) {
						var txt = $el.text().split(":");
						var _total = parseInt(txt[1].replace(/\D+/g, ""), 10);

						_total -= _this.archived.length;

						if (_total < 0) {
							_total = 0;
						}

						$el.text(txt[0] + ": " + _this.number_format(_total));

						return;
					}
				});
			}
		}
	}, {
		key: "number_format",
		value: function number_format() {
			var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
			var delim = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ",";

			return str.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delim) || "0";
		}
	}, {
		key: "container",
		value: function container() {
			var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
			    _ref$title = _ref.title,
			    title = _ref$title === undefined ? "" : _ref$title,
			    _ref$content = _ref.content,
			    content = _ref$content === undefined ? "" : _ref$content;

			var html = "";

			html += "<div class=\"container\">";
			html += "<div class=\"title-bar\"><h2>" + title + "</h2></div>";
			html += "<div class=\"content pad-all\">" + content + "</div>";
			html += "</div>";

			return $(html);
		}
	}, {
		key: "is_archived",
		value: function is_archived() {
			var user_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			if ($.inArrayLoose(user_id, this.archived) > -1) {
				return true;
			}

			return false;
		}
	}]);

	return Archive_Member;
}();

var Archive_Member_Profile = function () {
	function Archive_Member_Profile() {
		_classCallCheck(this, Archive_Member_Profile);

		this.page = pb.data("page");
		this.user = pb.data("user");

		var user_id = this.get_profile_id();

		if (!user_id) {
			return;
		}

		if (Archive_Member.is_archived(user_id)) {
			this.display_archived_message();
		}
	}

	_createClass(Archive_Member_Profile, [{
		key: "display_archived_message",
		value: function display_archived_message() {
			var $profile = $(".show-user").addClass("archived-member-profile");
			var $custom = $("#archived-member-profile-custom");

			if ($custom.length) {
				if (Archive_Member.settings.custom_profile_html.length) {
					$custom.html(Archive_Member.settings.custom_profile_html);
				}

				$custom.show();
			} else {
				$profile.before(Archive_Member.container({

					title: Archive_Member.settings.archived_title || "Archived",
					content: Archive_Member.settings.archived_message || "This member has been archived."

				}));
			}
		}
	}, {
		key: "get_profile_id",
		value: function get_profile_id() {
			var user_id = null;

			if (this.page.member && parseInt(this.page.member.id, 10)) {
				user_id = parseInt(this.page.member.id, 10);
			} else if (this.user.logged_in) {
				this.user_id = parseInt(this.user.id, 10);
			}

			return user_id;
		}
	}]);

	return Archive_Member_Profile;
}();

;

var Archive_Member_Members = function () {
	function Archive_Member_Members() {
		_classCallCheck(this, Archive_Member_Members);
	}

	_createClass(Archive_Member_Members, null, [{
		key: "init",
		value: function init() {
			this.find_archived();

			proboards.on("afterSearch", this.find_archived.bind(this));
		}
	}, {
		key: "find_archived",
		value: function find_archived() {
			var $trs = $(".list-content tr.member");

			$trs.each(function (index, elem) {
				var $el = $(elem);
				var id_str = $el.attr("id").split("-");

				if (id_str.length && id_str[1]) {
					var id = parseInt(id_str[1], 10);

					if (id && Archive_Member.is_archived(id)) {
						$el.addClass("archived-member-row");
						$el.find("td.last-online").html(Archive_Member.settings.members_text || "Archived");
					}
				}
			});
		}
	}]);

	return Archive_Member_Members;
}();

;

var Archive_Member_Mini_Profiles = function () {
	function Archive_Member_Mini_Profiles() {
		_classCallCheck(this, Archive_Member_Mini_Profiles);
	}

	_createClass(Archive_Member_Mini_Profiles, null, [{
		key: "init",
		value: function init() {
			this.find_archived();

			proboards.on("afterSearch", this.find_archived.bind(this));
		}
	}, {
		key: "find_archived",
		value: function find_archived() {
			var $mini_profiles = $(".item .mini-profile");

			if (!$mini_profiles.length) {
				return;
			}

			$mini_profiles.each(function (index, item) {
				var $mini_profile = $(item);
				var $user_link = $mini_profile.find("a.user-link");

				if ($user_link.length) {
					var user_id = parseInt($user_link.attr("data-id"), 10);

					if (Archive_Member.is_archived(user_id)) {
						$mini_profile.addClass("archived-member-mini-profile mini-profile-id-" + user_id);

						if (Archive_Member.settings.message_post) {
							$mini_profile.closest("tr").addClass("archived-member-post-message");
						}

						if (Archive_Member.settings.custom_mini_profile_html.length) {
							$mini_profile.append("<div class='archived-member-mini-profile-custom'>" + Archive_Member.settings.custom_mini_profile_html + "</div>");
						}
					}
				}
			});
		}
	}]);

	return Archive_Member_Mini_Profiles;
}();

;


Archive_Member.init();