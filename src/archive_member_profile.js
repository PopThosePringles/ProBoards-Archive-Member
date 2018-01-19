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