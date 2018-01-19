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