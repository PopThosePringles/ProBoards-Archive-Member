/**
 * Custom profiles or wanting to use custom HTML:
 * 	<div id="archived-member-profile-custom"></div>
 */

class Archive_Member {

	static init(){
		this.PLUGIN_ID = "pd_archive_member";
		this.PLUGIN_KEY = "pd_archived_member";

		this.settings = {};
		this.archived = [];
		this.images = {};

		this.route = pb.data("route").name;

		this.setup();

		if(this.archived.length == 0){
			return;
		}

		$(this.ready.bind(this));
	}

	static ready(){
		let route = this.route;

		let mini_profile_check = (

			route == "search_results" ||
			route == "conversation" ||
			route == "list_messages" ||
			route == "thread" ||
			route == "list_posts" ||
			route == "permalink" ||
			route == "all_recent_posts" ||
			route == "recent_posts" ||
			route == "posts_by_ip"

		);

		if(this.settings.mini_profile && mini_profile_check){
			Archive_Member_Mini_Profiles.init();
		} else if(route == "home" || route == "forum"){
			this.calculate_total_members();
		} else if(this.settings.members_page && (route == "members" || route == "list_members")){
			Archive_Member_Members.init();
		} else if(this.settings.profile_page){
			let profile_check = (

				route == "user" ||
				route == "show_user_activity" ||
				route == "show_user_following" ||
				route == "show_user_friends" ||
				route == "show_user_groups" ||
				route == "show_user_gift" ||

				route == "edit_user_avatar" ||
				route == "edit_user_personal" ||
				route == "edit_user_social" ||
				route == "edit_user_admin" ||
				route == "show_user_notifications"

			);

			if(profile_check){
				new Archive_Member_Profile();
			}
		}
	}

	static setup(){
		let plugin = pb.plugin.get(this.PLUGIN_ID);

		if(plugin && plugin.settings){
			this.settings = plugin.settings;

			this.settings.members_page = (this.settings.members_page == 1)? true : false;
			this.settings.profile_page = (this.settings.profile_page == 1)? true : false;
			this.settings.mini_profile = (this.settings.mini_profile == 1)? true : false;
			this.settings.message_post = (this.settings.include_message_post == 1)? true : false;
			this.archived = (typeof this.settings.archived != "undefined")? this.settings.archived : [];
		}
	}

	// Little long winded way of doing this.
	// Reason is that we need to be careful of names and
	// topic titles that might try to match what we are looking
	// for on purpose.  So we grab all TD elements and find the
	// one that just contains a matching text node.

	static calculate_total_members(){
		let $td = $(".stats td");

		$td.each((index, elem) => {
			let $el = $(elem);

			if($el.text().match(/^Total Members: ([\d\,\.]+)$/)){
				let txt = $el.text().split(":");
				let total = parseInt(txt[1].replace(/\D+/g, ""), 10);

				total -= this.archived.length;

				if(total < 0){
					total = 0;
				}

				$el.text(txt[0] + ": " + this.number_format(total));

				return;
			}
		});

	}

	static number_format(str = "", delim = ","){
		return (str.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delim) || "0");
	}

	static container({title = "", content = ""} = {}){
		let html = "";

		html += "<div class=\"container\">";
		html += "<div class=\"title-bar\"><h2>" + title + "</h2></div>";
		html += "<div class=\"content pad-all\">" + content + "</div>";
		html += "</div>";

		return $(html);
	}

	static is_archived(user_id = 0){
		if($.inArrayLoose(user_id, this.archived) > -1){
			return true;
		}

		return false;
	}

}

class Archive_Member_Profile {

	constructor(){
		this.page = pb.data("page");
		this.user = pb.data("user");

		let user_id = this.get_profile_id();

		if(!user_id){
			return;
		}

		if(Archive_Member.is_archived(user_id)){
			this.display_archived_message();
		}
	}

	display_archived_message(){
		let $profile = $(".show-user").addClass("archived-member-profile");
		let $custom = $("#archived-member-profile-custom");

		if($custom.length){
			if(Archive_Member.settings.custom_profile_html.length){
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

	get_profile_id(){
		let user_id = null;

		if(this.page.member && parseInt(this.page.member.id, 10)){
			user_id = parseInt(this.page.member.id, 10);
		} else if(this.user.logged_in){
			this.user_id = parseInt(this.user.id, 10);
		}

		return user_id;
	}

};

class Archive_Member_Members {

	static init(){
		this.find_archived();

		proboards.on("afterSearch", this.find_archived.bind(this));
	}

	static find_archived(){
		let $trs = $(".list-content tr.member");

		$trs.each((index, elem) => {
			let $el = $(elem);
			let id_str = $el.attr("id").split("-");

			if(id_str.length && id_str[1]){
				let id = parseInt(id_str[1], 10);

				if(id && Archive_Member.is_archived(id)){
					$el.addClass("archived-member-row");
					$el.find("td.last-online").html(Archive_Member.settings.members_text || "Archived");
				}
			}
		});
	}

};

class Archive_Member_Mini_Profiles {

	static init(){
		this.find_archived();

		proboards.on("afterSearch", this.find_archived.bind(this));
	}

	static find_archived(){
		let $mini_profiles = $(".item .mini-profile");

		if(!$mini_profiles.length){
			return;
		}

		$mini_profiles.each((index, item) => {
			let $mini_profile = $(item);
			let $user_link = $mini_profile.find("a.user-link");

			if($user_link.length){
				let user_id = parseInt($user_link.attr("data-id"), 10);

				if(Archive_Member.is_archived(user_id)){
					$mini_profile.addClass("archived-member-mini-profile mini-profile-id-" + user_id);

					if(Archive_Member.settings.message_post){
						$mini_profile.closest("tr").addClass("archived-member-post-message");
					}

					if(Archive_Member.settings.custom_mini_profile_html.length){
						$mini_profile.append("<div class='archived-member-mini-profile-custom'>" + Archive_Member.settings.custom_mini_profile_html + "</div>");
					}
				}
			}

		});
	}

};

Archive_Member.init();