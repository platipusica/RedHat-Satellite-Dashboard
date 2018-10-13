(function($, task) {
"use strict";

function Events1() { // rhdashboard 

	function on_page_loaded(task) {
		
		$("title").text(task.item_caption);
		$("#title").text(task.item_caption);
		 
		if (task.safe_mode) {
			$("#user-info").text(task.user_info.role_name + ' ' + task.user_info.user_name);
			$('#log-out')
			.show() 
			.click(function(e) {
				e.preventDefault();
				task.logout();
			}); 
		}
	
		$("#taskmenu").show();
		
		task.dashbord.open({open_empty: true});
		task.dashbord.append();
		task.dashbord.cur_server.value = 1;
		
		task.create_menu($("#menu"), true);
	} 
	
	function on_view_form_created(item) {
		var table_options = {
				height: 620,
				sortable: true
			};
	  
		if (!item.master) {
			item.paginate = true;
		}
	
		item.read_only = true;
		item.clear_filters();
	
		if (item.view_form.hasClass('modal')) {
			item.view_options.width = 1100;
			item.view_form.find("#form-title").hide();
		}
		else {
			item.view_form.find("#form-title a").text(item.item_caption)
				.click(function(e) {
					e.preventDefault();
					item.view(item.view_form.parent());
				});
			table_options.height = $(window).height() - $('body').height() - 20;
		}
		if (item.can_create()) {
			item.view_form.find("#new-btn").on('click.task', function(e) { 
				e.preventDefault();
				item.insert_record(); 
			});
		}
		else {
			item.view_form.find("#new-btn").prop("disabled", true);
		}
		
		item.view_form.find("#edit-btn").on('click.task', function(e) { 
			e.preventDefault();
			item.edit_record(); 
		});
		
		if (item.can_delete()) {
			item.view_form.find("#delete-btn").on('click.task', function(e) { 
				item.delete_record(); 
				e.preventDefault();	
			});
		}
		else {
			item.view_form.find("#delete-btn").prop("disabled", true);
		}
		
		create_print_btns(item);
	
		if (item.view_form.find(".view-table").length) {
			if (item.init_table) {
				item.init_table(item, table_options);
			}
			item.create_table(item.view_form.find(".view-table"), table_options);
			item.open({params: {server: task.dashbord.cur_server.value}}, true);
		}
	}
	
	function on_view_form_closed(item) {
		item.close();
	}
	
	function on_edit_form_created(item) {
		var options = {
				col_count: 1
			};
		if (item.init_inputs) {
			item.init_inputs(item, options);
		}
		if (item.edit_form.find(".edit-body").length) {
			item.create_inputs(item.edit_form.find(".edit-body"), options);
		}
		item.edit_form.find("#cancel-btn").on('click.task', function(e) { item.cancel_edit(e) });
		item.edit_form.find("#ok-btn").on('click.task', function() { item.apply_record() });
	}
	
	function on_edit_form_close_query(item) {
		var result = true;
		if (item.is_changing()) {
			if (item.is_modified()) {
				item.yes_no_cancel(task.language.save_changes,
					function() {
						item.apply_record();
					},
					function() {
						item.cancel_edit();
					}
				);
				result = false;
			}
			else {
				item.cancel();
			}
		}
		return result;
	}
	
	function on_filter_form_created(item) {
		item.filter_options.title = item.item_caption + ' - filter';
		item.create_filter_inputs(item.filter_form.find(".edit-body"));
		item.filter_form.find("#cancel-btn")
			.on('click.task', function() { item.close_filter_form() });
		item.filter_form.find("#ok-btn")
			.on('click.task', function() { item.apply_filters() });
	}
	
	function on_param_form_created(item) {
		item.create_param_inputs(item.param_form.find(".edit-body"));
		item.param_form.find("#cancel-btn")
			.on('click.task', function() { item.close_param_form() });
		item.param_form.find("#ok-btn")
			.on('click.task', function() { item.process_report() });
	}
	
	function on_before_print_report(report) {
		var select;
		report.extension = 'pdf';
		if (report.param_form) {
			select = report.param_form.find('select');
			if (select && select.val()) {
				report.extension = select.val();
			}
		}
	}
	
	function on_view_form_keyup(item, event) {
		if (event.keyCode === 45 && event.ctrlKey === true){
			item.insert_record();
		}
		else if (event.keyCode === 46 && event.ctrlKey === true){
			item.delete_record();
		}
	}
	
	function on_edit_form_keyup(item, event) {
		if (event.keyCode === 13 && event.ctrlKey === true){
			item.edit_form.find("#ok-btn").focus();
			item.apply_record();
		}
	}
	
	function create_print_btns(item) {
		var i,
			$ul,
			$li,
			reports = [];
		if (item.reports) {
			for (i = 0; i < item.reports.length; i++) {
				if (item.reports[i].can_view()) {
					reports.push(item.reports[i]);
				}
			}
			if (reports.length) {
				$ul = item.view_form.find("#report-btn ul");
				for (i = 0; i < reports.length; i++) {
					$li = $('<li><a href="#">' + reports[i].item_caption + '</a></li>');
					$li.find('a').data('report', reports[i]);
					$li.on('click', 'a', function(e) {
						e.preventDefault();
						$(this).data('report').print(false);
					});
					$ul.append($li);
				}
			}
			else {
				item.view_form.find("#report-btn").hide();
			}
		}
		else {
			item.view_form.find("#report-btn").hide();
		}
	}
	this.on_page_loaded = on_page_loaded;
	this.on_view_form_created = on_view_form_created;
	this.on_view_form_closed = on_view_form_closed;
	this.on_edit_form_created = on_edit_form_created;
	this.on_edit_form_close_query = on_edit_form_close_query;
	this.on_filter_form_created = on_filter_form_created;
	this.on_param_form_created = on_param_form_created;
	this.on_before_print_report = on_before_print_report;
	this.on_view_form_keyup = on_view_form_keyup;
	this.on_edit_form_keyup = on_edit_form_keyup;
	this.create_print_btns = create_print_btns;
}

task.events.events1 = new Events1();

function Events2() { // rhdashboard.catalogs 

	function on_view_form_created(item) {
		var timeOut,
			i,
			search,
			captions = [],
			field,
			search_field;
		if (item.default_field) {
			search_field = item.default_field.field_name;
			if (item.lookup_field && item.lookup_field.value && !item.lookup_field.multi_select) {
				item.view_form.find("#selected-value")
					.text(item.lookup_field.display_text)
					.click(function() {
						item.view_form.find('#search-input').val(item.lookup_field.lookup_text);					
						item.search(item.default_field.field_name, item.lookup_field.lookup_text);
					});
				item.view_form.find("#selected-div").css('display', 'inline-block');
			}
			item.view_form.find('#search-fieldname').text(
				item.field_by_name(search_field).field_caption);
			item.view_form.find('#search-field-info')
				.popover({
					container: 'body',
					placement: 'left',
					trigger: 'hover',
					title: 'Search field selection',
					content: 'To select a search field hold Ctrl key and click on the corresponding column of the table.'
				})
				.click(function(e) {
					e.preventDefault();
				});
			search = item.view_form.find("#search-input");
			search.on('input', function() {
				var input = $(this);
				search.css('font-weight', 'normal');
				clearTimeout(timeOut);
				timeOut = setTimeout(function() {
						var field = item.field_by_name(search_field),
							search_type = 'contains_all';
						if (field.lookup_type !== 'text') {
							search_type = 'eq';
						}
						item.search(search_field, input.val(), search_type, function() {
							search.css('font-weight', 'bold');
						});
					},
					500
				);
			});
			search.keydown(function(e) {
				var code = e.which;
				if (code === 13) {
					e.preventDefault();
				}
				else if (code === 40) {
					item.view_form.find('.dbtable.' + item.item_name + ' .inner-table').focus();
	//				item.view_form.find(".inner-table").focus();
					e.preventDefault();
				}
			});
			item.view_form.on('keydown', function(e) {
				var code = e.which;
				if (isCharCode(code) || code === 8) {				
					if (!search.is(":focus")) {
						if (code !== 8) {
							search.val('');
						}
						search.focus();
					}
				}
			});
			item.view_form.on('click.search', '.dbtable.' + item.item_name + ' .inner-table td', function(e) {
				var field;
				if (e.ctrlKey) {			
					if (search_field !== $(this).data('field_name')) {
						search_field = $(this).data('field_name');
						field = item.field_by_name(search_field);
						if (field && field.lookup_type !== "blob" && field.lookup_type !== "currency" &&
							field.lookup_type !== "float" && field.lookup_type !== "boolean" && 
							field.lookup_type !== "date" && field.lookup_type !== "datetime") {
							item.view_form.find('#search-fieldname')
								.text(item.field_by_name(search_field).field_caption);
							item.view_form.find("#search-input").val('');
						}
					}
				}
			});
		}
		else {
			item.view_form.find("#search-form").hide();
		}
	}
	
	function isCharCode(code) {
		if (code >= 48 && code <= 57 || code >= 96 && code <= 105 || 
			code >= 65 && code <= 90 || code >= 186 && code <= 192 || 
			code >= 219 && code <= 222) {
			return true;
		}
	}
	
	function on_view_form_shown(item) {
		if (item.default_field) {
			item.view_form.find("#search-input").focus();
		}
		else {
			item.view_form.find('.dbtable.' + item.item_name + ' .inner-table').focus();
		}
	}
	this.on_view_form_created = on_view_form_created;
	this.isCharCode = isCharCode;
	this.on_view_form_shown = on_view_form_shown;
}

task.events.events2 = new Events2();

function Events3() { // rhdashboard.journals 

	function on_view_form_created(item) { 
		item.view_form.find("#filter-btn").click(function() {item.create_filter_form()});	
		if (!item.on_filters_applied) {
			item.on_filters_applied = function() {
				if (item.view_form) {
					item.view_form.find("#filter-text").text(item.get_filter_text());		
				}
			};
		}
	}
	
	function on_view_form_shown(item) {
		item.view_form.find('.dbtable.' + item.item_name + ' .inner-table').focus();
	}
	this.on_view_form_created = on_view_form_created;
	this.on_view_form_shown = on_view_form_shown;
}

task.events.events3 = new Events3();

function Events6() { // rhdashboard.satellite 

	function on_view_form_created(item) {
		task.catalogs.on_view_form_created(item);
	}
	this.on_view_form_created = on_view_form_created;
}

task.events.events6 = new Events6();

function Events8() { // rhdashboard.satellite.rhnserver 

	function on_after_scroll(item) {
		if (item.rec_count) {
			item.view_form.find('#desc').text(item.name.value + ': ' + item.description.value);
		}
	}
	this.on_after_scroll = on_after_scroll;
}

task.events.events8 = new Events8();

function Events14() { // rhdashboard.analitics.dashbord 

	function on_view_form_created(item) {
		item.charts = {};
		item.read_only = false;
		item.create_inputs(item.view_form.find('#cur-server'), {col_count: 2, in_well: false});
		show_charts(item);
	}
	
	function on_field_changed(field, lookup_item) {
		var item = field.owner;
		$("#title").text(task.item_caption + ' - ' + item.cur_server.display_text);
		show_charts(item);
		
		//empty previous graphs
	}
	
	function show_charts(item) {
		if (item.view_form) {
			item.view_form.find('#sg-canvas, #rk-canvas, #ram-canvas, #cpu-canvas, #arch-canvas, #product-canvas').empty();
			
			show_systemgroups(item, item.view_form.find('#sg-canvas').get(0).getContext('2d'));
			show_runningkernel(item, item.view_form.find('#rk-canvas').get(0).getContext('2d'));
			show_ram(item,item.view$('#ram-canvas')[0].getContext('2d'));
			show_cpu(item,item.view$('#cpu-canvas')[0].getContext('2d'));
			show_arch(item,item.view$('#arch-canvas')[0].getContext('2d'));
			show_prd(item,item.view$('#product-canvas')[0].getContext('2d'));					
		}	
	}
	
	function scramble(text) {
		var array = [];
		for (var i = 0; i < text.length; i ++) { 
			array.push(text[i]) ;
		}
		for (i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array.join('');
	}
	
	function show_systemgroups(item, ctx) {
		var sg = item.task.rhnservergroup.copy({handlers: false});
		
		sg.on_field_get_text = function(field) {
			if (field.field_name === 'description') {
				return scramble(field.value);
			}
		};
		
	//	sg.open(where={'group_type':0});
		sg.set_where({group_type__isnull: 1});
		sg.open(
			{
				params: {server: item.cur_server.value},
				fields: ['description', 'current_members'],
				order_by: ['-current_members'],
				limit: 10
			},
			function() {
				var labels = [],
					data = [],
					colors = [];
				sg.each(function(i) {
					labels.push(i.description.display_text);
					data.push(i.current_members.value);
					colors.push(lighten('#006bb3', (i.rec_no - 1) / 10));
				});
				sg.first();
				sg.description.field_caption = 'System Groups';
				sg.current_members.field_caption = 'Number of Servers';			
				draw_chart(item, ctx, labels, data, colors, 'Ten most System Groups');
				sg.create_table(item.view_form.find('#sg-table'), 
					{row_count: 10, dblclick_edit: false});
			}
		);
		return sg;
	}
	function show_runningkernel(item, ctx) {
		var rk = item.task.rhnserver.copy({handlers: false});
		
		//rk.set_where({group_type__isnull: 1});
		rk.open(
			{
				params: {server: item.cur_server.value},
				fields: ['running_kernel', 'id'],
				funcs: {id: 'count'},			
				group_by: ['running_kernel'],
				order_by: ['-id'],			
				limit: 10
			},
			function() {
				var labels = [],
					data = [],
					colors = [];
				rk.each(function(i) {
					labels.push(i.running_kernel.display_text);
					data.push(i.id.value);
					colors.push(lighten('#196619', (i.rec_no - 1) / 10));
				});
				rk.first();
				rk.running_kernel.field_caption = 'Running Kernel';
				rk.id.field_caption = 'Number of Servers';			
				draw_chart(item, ctx, labels, data, colors, 'Ten most Running Kernels');
				rk.create_table(item.view_form.find('#rk-table'), 
					{fields: ['running_kernel', 'id'], row_count: 10, dblclick_edit: false});
			}
		);
		return rk;
	}
	function show_ram(item, ctx) {
		var ram = item.task.rhnram.copy({handlers: false});
		ram.open(
			{
				params: {server: item.cur_server.value},
				expanded: false,
				fields: ['ram', 'server_id'],
				funcs: {server_id: 'count'},	   
				group_by: ['ram'],
				order_by: ['-ram'],
				limit: 8
			},
	
			function() {
				var labels = [],
					data = [],
					colors = [];
				ram.each(function(t) {
					labels.push(t.ram.value);
					data.push(t.server_id.value);
					colors.push(lighten('#0099ff', (t.rec_no - 1) / 8));
				});
				ram.first();
				ram.server_id.field_caption = 'Number of Servers';			
				ram.ram.field_caption = 'Memory Used';
				draw_chart(item, ctx, labels, data, colors, 'Top 8 Memory Used in MB');
				ram.create_table(item.view$('#ram-table'),
					{row_count: 8, dblclick_edit: false});
			}
		);
		return ram;
	}
	function show_cpu(item, ctx) {
		var cpu = item.task.rhncpu.copy({handlers: false});
		cpu.open(
			{
				params: {server: item.cur_server.value},
				expanded: false,
				fields: ['nrcpu', 'server_id'],
				funcs: {server_id: 'count'},	   
				group_by: ['nrcpu'],
				order_by: ['-nrcpu'],
				limit: 10
			},
	
			function() {
				var labels = [],
					data = [],
					colors = [];
				cpu.each(function(t) {
					labels.push(t.nrcpu.value);
					data.push(t.server_id.value);
					colors.push(lighten('#196619', (t.rec_no - 1) / 8));
				});
				cpu.first();
				cpu.server_id.field_caption = 'Number of Servers';			
				cpu.nrcpu.field_caption = 'Number of Cores';
				draw_chart(item, ctx, labels, data, colors, 'Top 8 Number of Cores');
				cpu.create_table(item.view$('#cpu-table'),
					{row_count: 8, dblclick_edit: false});
			}
		);
		return cpu;
	}
	function show_arch(item, ctx) {
		var ar = item.task.rhnserver.copy({handlers: false});
		ar.open(
			{
				params: {server: item.cur_server.value},
	 //		   expanded: false,			
				fields: ['server_arch_id', 'id'],
				funcs: {id: 'count'},			
				group_by: ['server_arch_id'],
				order_by: ['-id'],			
				limit: 10
			},
	
			function() {
				var labels = [],
					data = [],
					colors = [];
				ar.each(function(i) {
					labels.push(i.server_arch_id.display_text);
					data.push(i.id.value);
					colors.push(lighten('#196619', (i.rec_no - 1) / 10));
				});
				ar.first();
				ar.server_arch_id.field_caption = 'Running Arch';
				ar.id.field_caption = 'Number of Servers';			
				draw_chart(item, ctx, labels, data, colors, 'Ten most Running Archs');
				ar.create_table(item.view_form.find('#arch-table'), 
					{fields: ['server_arch_id', 'id'], row_count: 10, dblclick_edit: false});
			}
		);
		return ar;
	}
	
	function show_prd(item, ctx) {
		var prd = item.task.rhnserverdmi.copy({handlers: false});
		
		prd.open(
			{
				params: {server: item.cur_server.value},
				fields: ['product', 'vendor', 'server_id'],
				funcs: {server_id: 'count'},		 
				group_by: ['product','vendor'],			
				order_by: ['-server_id'],
				limit: 10
			},
			function() {
				var labels = [],
					data = [],
					colors = [];
				prd.each(function(i) {
					labels.push(i.product.display_text);
					data.push(i.server_id.value);
					colors.push(lighten('#006bb3', (i.rec_no - 1) / 10));
				});
				prd.first();
				prd.vendor.field_caption = 'Vendor';			
				prd.product.field_caption = 'Products';
				prd.server_id.field_caption = 'Number of Servers';			
				draw_chart(item, ctx, labels, data, colors, 'Ten most Vendor Products');
				prd.create_table(item.view_form.find('#prd-table'), 
					{row_count: 10, dblclick_edit: false});
			}
		);
		return prd;
	}
	
	function draw_chart(item, ctx, labels, data, colors, title) {
		if (item.charts[title]) {
			item.charts[title].destroy();
		}
		var chart = new Chart(ctx,{
			type: 'pie',
			data: {
				labels: labels,
				datasets: [
					{
						data: data,
						backgroundColor: colors
					}
				]					
			},
			options: {
				 title: {
					display: true,
					fontsize: 14,
					text: title
				},
				legend: {
					position: 'bottom',
				},
			}
		});
		item.charts[title] = chart;
	}
	
	function lighten(color, luminosity) {
		color = color.replace(/[^0-9a-f]/gi, '');
		if (color.length < 6) {
			color = color[0]+ color[0]+ color[1]+ color[1]+ color[2]+ color[2];
		}
		luminosity = luminosity || 0;
		var newColor = "#", c, i, black = 0, white = 255;
		for (i = 0; i < 3; i++) {
			c = parseInt(color.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(black, c + (luminosity * white)), white)).toString(16);
			newColor += ("00"+c).substr(c.length);
		}
		return newColor; 
	}
	this.on_view_form_created = on_view_form_created;
	this.on_field_changed = on_field_changed;
	this.show_charts = show_charts;
	this.scramble = scramble;
	this.show_systemgroups = show_systemgroups;
	this.show_runningkernel = show_runningkernel;
	this.show_ram = show_ram;
	this.show_cpu = show_cpu;
	this.show_arch = show_arch;
	this.show_prd = show_prd;
	this.draw_chart = draw_chart;
	this.lighten = lighten;
}

task.events.events14 = new Events14();

})(jQuery, task)