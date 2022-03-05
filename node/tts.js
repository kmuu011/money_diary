// let L1 = '..xx.x.';
// let L2 = 'x.x.x..';

let L1 = 'x...x';
let L2 = '..x..';

let on_line = L1;
let other_line;
let x_count = 0;

for(let i=0 ; i<L1.length ; i++){
    let l1_count = 0;
    let l2_count = 0;

    for(let j=i ; j<(i+Math.ceil(L1.length/2)) ; j++){
        if(L1[j] === 'x') l1_count++;
        if(L2[j] === 'x') l2_count++;
    }

    if(l1_count > l2_count){
        on_line = L2;
    }else if(l1_count < l2_count){
        on_line = L1;
    }

    other_line = on_line === L2 ? L1 : L2;

    if(other_line[i] === 'x') x_count++;
}

console.log(x_count);