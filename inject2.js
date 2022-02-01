(function() {

	// just place a div at top right
	var div = document.createElement('div');
	//document.body.innerHTML='';
	div.style.position = 'fixed';
	div.style.top = 0;
	div.style.right = 0;
	div.textContent = 'Injected!';
	document.body.appendChild(div);

	//alert('inserted self... giggity');


function setNativeValue(e, value) {
		element=document.querySelectorAll('[inputmode='numeric']')[e]
		let keys = Object.keys(element);
		console.log(keys)
for (let i = 0; i < keys.length; i++) {
  let val = element[keys[i]];
  console.log(val);
}
		console.log(element,e,value,Object.getOwnPropertyDescriptor(element.prototype, 'value'))
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else {
            valueSetter.call(element, value);
        }
    }

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}




function range(start, stop, step) {
    var a = [start], b = start;
    while (b < stop) {
        a.push(b += step || 1);
    }
    return a;
}



const change_values=function(values){
	opensetting=document.getElementsByClassName('backtesting-head-wrapper')[0].children[1].children[0]
	opensetting.click()
	
	waitForElm('[data-name='indicator-properties-dialog']').then((elm) => {
    console.log('Element is ready');
    console.log(elm.textContent);
	inputs=document.querySelectorAll('[inputmode='numeric']')
	for(var inp=0;inp<inputs.length ; inp++)
	{
	input1=inputs[inp];
	console.log('values are ',values,inp,values[inp])
	console.log('setting',values[inp])
	setNativeValue(inp,values[inp]);
	input1.dispatchEvent(new Event('input', { bubbles: true }));
	}
	sub=document.querySelectorAll('[name='submit']')[0];
	sub.click()
	});
	
}	

function run_one_search()
{
	z=output[i]
	if(i>=output.length)
	{
		clearInterval(timer);
		console.log('finished search');
		console.log(search);
		best=Object.keys(search).reduce(function(a, b){ return parseFloat(search[a].replace('−','-')) > parseFloat(search[b].replace('−','-')) ? a : b });
		change_values(best.split(',').map(parseFloat))
		return true;
	}
		
	if(i!=-1)
	search[z]=(document.querySelector('#bottom-area > div.bottom-widgetbar-content.backtesting > div.backtesting-content-wrapper > div').innerText.split('\n')[0].replace('$', '').replace('No data', '0'));
	//#console.log('got',z,search[z])
	//console.log('got',z,search[z].replace('−','-'))
	//search[z]=parseFloat(search[z].replace('−','-'))
	console.log('got',z,search[z])
	i+=1
	z=output[i]
	change_values(z)
}


waitForElm('[data-name='indicator-properties-dialog']').then((elm) => {
    //console.log('Element is ready');
    //console.log(elm.textContent);
	inputs=document.querySelectorAll('[inputmode='numeric']')
	inplowers=[];
	inphighers=[];
	console.log(inputs.length)
	for(var inp=0;inp<(inputs.length) ; inp++)//(inputs.length/2)
	{
	input1=inputs[inp];
	parent1=input1.parentNode;
	input1c_lower=input1.cloneNode(true);
	input1c_lower.id=inp.toString()+'l';
	inplowers.push(input1c_lower);
	parent1.appendChild(input1c_lower)
	input1c_higher=input1.cloneNode(true);
	input1c_higher.id=inp.toString()+'h';
	inphighers.push(input1c_higher);
	parent1.appendChild(input1c_higher)
	}
	btn=document.querySelector('#overlap-manager-root > div > div > div.dialog-2AogBbC7.dialog-2cMrvu9r.dialog-UM6w7sFp.rounded-UM6w7sFp.shadowed-UM6w7sFp > div > div.footer-KW8170fm > div > span > button')
	parent_btn=btn.parentNode;
	
	btn_run=document.createElement('button');//btn.cloneNode(false);
	btn_run.id='l';
	btn_run.innerText='RUN'
	btn_run.style=btn.style
	btn_run.onclick=function (){
	wholeinp=[]
	console.log('inplows',inplowers)
	console.log('inphighers',inphighers)
	console.log('clicked')
	for (var inp=0;inp<inplowers.length ; inp++)
	{
		console.log(inp,range(parseInt(inplowers[inp].value),parseInt(inphighers[inp].value),1))
		wholeinp.push(range(parseInt(inplowers[inp].value),parseInt(inphighers[inp].value),1))
	}
	console.log(wholeinp);
	generate_combinations(wholeinp);
	sub=document.querySelectorAll('[name='submit']')[0];
	sub.click()
	};
	parent_btn.appendChild(btn_run)
	});


var output = []
var timer=0
function generate_combinations(arr)
{
	
	// Number of arrays
	console.log(arr);
	let n = arr.length;
	
	// To keep track of next element in
	// each of the n arrays
	let indices = new Array(n);
	
	// Initialize with first element's index
	for(let i = 0; i < n; i++)
		indices[i] = 0;
	j=0;
	while (true)
	{
	
		// Print current combination
		let temp=[]
		for(let i = 0; i < n; i++)
		{
			console.log(j);
			temp.push(
			arr[i][indices[i]]);
		}
		j+=1
		output.push(temp)
		// Find the rightmost array that has more
		// elements left after the current element
		// in that array
		let next = n - 1;
		while (next >= 0 && (indices[next] + 1 >=
								arr[next].length))
			next--;
		
		// No such array is found so no more
		// combinations left
		if (next < 0)
		{
			timer=setInterval(run_one_search, 1000);
			return;
		}
		// If found move to next element in that
		// array
		indices[next]++;
		
		// For all arrays to the right of this
		// array current index again points to
		// first element
		for(let i = next + 1; i < n; i++)
			indices[i] = 0;
	}
	
}


var output=[]
var i=-1
var search={}

})();
