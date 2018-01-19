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