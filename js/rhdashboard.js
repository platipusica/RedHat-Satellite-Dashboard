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
		
		if (task.full_width) {
			$('#container').removeClass('container').addClass('container-fluid');
		}
		$('#container').show();
		
		task.dashboard.open({open_empty: true});
		task.dashboard.append();
		task.dashboard.cur_server.value = 1;
		task.dashboard.create_inputs($('.select-server'), {in_well: false, label_size: 2});
		
		task.create_menu($("#menu"), $("#content"), {
			splash_screen: '<h1 class="text-center">RedHat Satellite 5.x Dashboard</h1>',
			view_first: true
		});
	
		// $(document).ajaxStart(function() { $("html").addClass("wait"); });
		// $(document).ajaxStop(function() { $("html").removeClass("wait"); });
	} 
	
	function on_view_form_created(item) {
		var table_height = item.table_options.height, 
			height,
			detail,
			detail_container;
	
		item.clear_filters();
		if (item.view_form.hasClass('modal')) {
			item.view_options.width = 1060;
			table_height = $(window).height() - 300;
		}
		else {
			if (!table_height) {
				table_height = $(window).height() - $('body').height() - 20;
			}
		}
		if (item.can_create()) {
			item.view_form.find("#new-btn").on('click.task', function(e) { 
				e.preventDefault();
				if (item.master) {
					item.append_record();
				}
				else {
					item.insert_record();				
				}
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
				e.preventDefault();
				item.delete_record(); 
			});
		}
		else {
			item.view_form.find("#delete-btn").prop("disabled", true);
		}
		
		if (!item.master && item.owner.on_view_form_created) {
			item.owner.on_view_form_created(item);
		}
	
		if (item.on_view_form_created) {
			item.on_view_form_created(item);
		}
		
		if (item.view_form.find(".view-table").length) {
			if (item.view_options.view_detail) {
				detail_container = item.view_form.find('.view-detail');
				if (detail_container) {
					height = item.view_options.detail_height;
					if (!height) {
						height = 200;
					}
					item.create_detail_table(detail_container, {height: height});
					table_height -= height;
				}
			}
			if (item.master) {
				table_height = item.master.edit_options.detail_height;
				if (!table_height) {
					table_height = 260;
				}
			}
			if (!item.table_options.height) {
				item.table_options.height = table_height;
			}
			item.create_table(item.view_form.find(".view-table"));
			if (!item.master) {
				item.open({params: {server: task.dashboard.cur_server.value}}, true);
			}
		}
		create_print_btns(item);
		return true;
	}
	
	function on_view_form_shown(item) {
		item.view_form.find('.dbtable.' + item.item_name + ' .inner-table').focus();
	}
	
	function on_view_form_closed(item) {
		// if (!item.master) {
		//	 item.close();
		// }
	}
	
	function on_edit_form_created(item) {
		item.edit_form.find("#cancel-btn").on('click.task', function(e) { item.cancel_edit(e) });
		item.edit_form.find("#ok-btn").on('click.task', function() { item.apply_record() });
		
		if (!item.master && item.owner.on_edit_form_created) {
			item.owner.on_edit_form_created(item);
		}
	
		if (item.on_edit_form_created) {
			item.on_edit_form_created(item);
		}
			
		item.create_inputs(item.edit_form.find(".edit-body"));
		item.create_detail_views(item.edit_form.find(".edit-detail"));
	
		return true;
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
				item.cancel_edit();
			}
		}
		return result;
	}
	
	function on_filter_form_created(item) {
		item.filter_options.title = item.item_caption + ' - filters';
		// item.filter_options.close_focusout = true;
		item.create_filter_inputs(item.filter_form.find(".edit-body"));
		item.filter_form.find("#cancel-btn").on('click.task', function() {
			item.close_filter_form(); 
		});
		item.filter_form.find("#ok-btn").on('click.task', function() { 
			item.set_order_by(item.view_options.default_order);
			item.apply_filters(item._search_params); 
		});
	}
	
	function on_param_form_created(item) {
		item.create_param_inputs(item.param_form.find(".edit-body"));
		item.param_form.find("#cancel-btn").on('click.task', function() { 
			item.close_param_form();
		});
		item.param_form.find("#ok-btn").on('click.task', function() { 
			item.process_report();
		});
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
			if (item.master) {
				item.append_record();
			}
			else {
				item.insert_record();				
			}
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
	this.on_view_form_shown = on_view_form_shown;
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

function Events8() { // rhdashboard.satellite.rhnserver 

	function on_after_scroll(item) {
		if (item.rec_count) {
			item.view_form.find('#desc').text(item.name.value + ': ' + item.description.value);
		}
	}
	this.on_after_scroll = on_after_scroll;
}

task.events.events8 = new Events8();

function Events14() { // rhdashboard.analitics.dashboard 

	function on_view_form_created(item) {
		item.charts = {};
		item.read_only = false;
		show_charts(item);
	}
	
	function on_field_changed(field, lookup_item) {
		var item = field.owner;
		show_charts(item);
		task.satellite.each_item(function(i) {
		   if (i.active) {
			   i.open({params: {server: item.cur_server.value}});
		   }
		});
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
					{row_count: 10, dblclick_edit: false, row_line_count: 1});
			}
		);
		return sg;
	}
	function show_runningkernel(item, ctx) {
		var rk = item.task.rhnserver.copy({handlers: false});
		
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
					{fields: ['running_kernel', 'id'], row_count: 10, dblclick_edit: false, row_line_count: 1});
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
					{row_count: 8, dblclick_edit: false, row_line_count: 1});
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
					{row_count: 8, dblclick_edit: false, row_line_count: 1});
			}
		);
		return cpu;
	}
	function show_arch(item, ctx) {
		var ar = item.task.rhnserver.copy({handlers: false});
		ar.open(
			{
				params: {server: item.cur_server.value},
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
					{fields: ['server_arch_id', 'id'], row_count: 10, dblclick_edit: false, row_line_count: 1});
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
					{row_count: 10, dblclick_edit: false, row_line_count: 1});
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