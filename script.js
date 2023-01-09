// Function collapse on any HTML Element.
HTMLElement.prototype.collapse = function() {
	// If has the attribute data-parent, close all the others collapses.
	if (this.getAttribute('data-parent') != null) {
		// Transform in array to do a loop forEach
		Array.from( document.querySelector(this.getAttribute('data-parent')).querySelectorAll('.collapse.show') )
			.forEach(el => {
				// If the element isn't herself, remove the class.
				if (el != this) {
					el.classList.remove('show');
					document.querySelector(`[data-target="#${el.id}"]`).setAttribute('data-expanded',false);
					el.style.height = null;
				}
			})
	}
	// Toggle the class.
	this.classList.toggle('show')
 
	// And set the height
	if (this.classList.contains('show')) {
		this.style.height = String(this.scrollHeight) + 'px';
	} else {
		this.style.height = null;
	}
}
 
HTMLElement.prototype.modal = function() {
	this.classList.toggle('active')
}
 
HTMLElement.prototype.tab = function() {
	if (this.getAttribute('data-parent') != null) {
		document.querySelector(this.getAttribute('data-parent')).querySelector('.tab-pane.active').classList.remove('active');
	}
	this.classList.add('active')
}
 
 
 // Format elements as currency
HTMLInputElement.prototype.toCurrency = function(currency='BRL') {
	var formatter = new Intl.NumberFormat('pt-BR', {
		style: 'currency', currency: currency,
	});
 
	// Get value props to don't do a loop formatting.
	var props = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
	
	// Set the value and configs
	this.value = formatter.format(this.value.replace(/[^0-9]/g,''))
	this.inputmode = 'decimal'
 
	
	// Format values on input.
	this.oninput = (event) => {
		let value = parseFloat(props.get.call(this).replace(/[^0-9]/g,'')) / 100
		props.set.call(event.target,formatter.format(value || 0));
	}
 
	// Format values setted by '.value'.
	Object.defineProperty(this, 'value', {
		set: function (value) {
				return props.set.call(this,formatter.format(value || 0))
		},
		get: function() {
			let value = props.get.call(this)
			return String( parseFloat( value.replace(/[^0-9]/g,'') ).toFixed(2) / 100 )
		}
	}); 
}
 
 
// Generate function to get the date in an input valid format
Date.prototype.dateToInputValue = function(month=0) {
	var local = new Date(this);
	local.setMinutes(this.getMinutes() - this.getTimezoneOffset())
	local.setMonth(local.getMonth() + month)
	return local.toJSON().slice(0,10)
}

window.onclick = function(e) {
   if (e.target.getAttribute('data-toggle') != null && e.target.getAttribute('data-target') != null) {
	   e.preventDefault();
	   handleMethod(
		   e.target,
		   document.querySelector(e.target.getAttribute('data-target')),
		   e.target.getAttribute('data-toggle'),  
	   );
   }
   if (e.target.getAttribute('data-dismiss') != null || e.target.classList.contains('modal','active')) {
	   document.querySelector('.modal.active').modal()
   }
}

// Get the method as string and call the assigned method.
function handleMethod(parent = null,target,method) {
   switch (method) {
	   
	   case 'collapse':
		   target.collapse();
		   if (parent != null) {
			   parent.setAttribute('data-expanded',[null, "false"].includes(parent.getAttribute('data-expanded')))
		   }
		   break;
	   
	   case 'modal':
		   target.modal();
		   break;
	   
	   case 'tab':
		   if (parent != null & parent.classList.contains('active') == false) {
			   parent.parentElement.parentElement.querySelector('.tab.active').classList.remove('active');
			   parent.classList.add('active');
		   }
		   target.tab();
		   break;
   }
}