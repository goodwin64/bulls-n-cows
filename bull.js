;
(function() {
    var step = 1, // turns count
        comp_step = null, // number from AI on current turn
        step_str = '', // current number in string-view
        comp_num = null, // current AI number
        comp_str = '', // current AI number in string-view
        res_bull = 0, // bulls result
        res_cow = 0, // cows recult
        answers = [], // resolves variants
        user, comp, tr, res_comp, res_user;


    window.onload = function() {
        var set_number = $('#set_number'),
            user_num = $('#user_num');
        user = $('#user');
        comp = $('#comp');
        res_comp = $('td', comp);
        res_user = $('td', user);


        tr = $('tr', user)[0].cloneNode(true);
        $('#start_game').onclick = startGame;

        // input numbers filter
        user_num.oninput = function() {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 4) this.value = this.value.slice(0, 4);
            if (this.value.length == 4) set_number.disabled = false;
        };
        // duplicates filter
        user_num.onkeypress = function(e) {
            e = e || window.event;
            var key = String.fromCharCode(e.keyCode || e.charCode);
            if (this.value.indexOf(key) !== -1) return false;
        };

        set_number.onclick = function() {
            var user_num = $('#user_num'),
                res = checkNumber(user_num.value),
                pos = (step - 1) * 3;
            if (pos > res_user.length - 1) {
                user.appendChild(tr.cloneNode(true));
                //comp.appendChild(tr.cloneNode(true));
                //res_comp = $('td', comp);
                res_user = $('td', user);
            }
            res_user[pos].innerHTML = user_num.value;
            res_user[pos + 1].innerHTML = res.bull;
            res_user[pos + 2].innerHTML = res.cow;
            if (res.bull == 4) {
                alert('You win!\nThe number was ' + user_num.value);
                return;
            }
            user_num.value = '';
            set_number.disabled = 'true';
            
            if (res_cow + res_bull > 4) {
                return alert("You're wrong somewhere!\nStart the game again");
            }

            filterAnswers(comp_step, step_str, res_bull, res_cow);
            ++step;
        };
        //startGame(); // auto-begin on window-load
    };

    // mini j :)
    function $(name, element) {
        var el = (element || document).querySelectorAll(name);
        return el ? (el.length > 1 ? Array.apply(null, el) : el[0]) : [];
    }

    function startGame() {
        $("#hide-info-block").style.display = "block";
        step = 1;
        // AI's number
        answers = buildAnswers();
        comp_num = randNum();
        // in <string> view
        comp_str = comp_num.join('');
        // clear values
        var allTd = $('table.tbl_result tbody td');
        for (var i = 0; i < allTd.length; i++) {
            allTd[i].innerHTML = '&nbsp;';
        }
    }

    /*
    checking the equality of bulls' and cows' count of the computer and entered by user
    */
    function checkNumber(num) {
        var bull = 0,
            cow = 0;
        num = num.split('');
        for (var i = 0; i < num.length; i++) {
            if (comp_num[i] == num[i]) {
                ++bull;
            } else {
                if (comp_str.indexOf(num[i]) !== -1) ++cow;
            }
        }
        return {
            bull: bull,
            cow: cow
        };
    }

    // all variants 4-digit numbers, satisfying the task
    function buildAnswers() {
        var all_res = [];
        for (var i = 1; i < 10; ++i) {
            for (var j = 0; j < 10; ++j) {
                if (j == i) continue;
                for (var k = 0; k < 10; ++k) {
                    if (k == j || k == i) continue;
                    for (var l = 0; l < 10; ++l) {
                        if (l == k || l == j || l == i) continue;
                        all_res.push([i, j, k, l]);
                    }
                }
            }
        }
        return all_res;
    }

    // solving cases filter
    function filterAnswers(num, num_str, bull, cow) {
        var tmp = [],
            tmp_bull, tmp_cow, this_num;
        t: for (var i = 0; i < answers.length; i++) {
            this_num = answers[i];
            if (this_num == num) continue t;
            if (cow === 0 && bull === 0) {
                for (var c = 0; c < 4; ++c) {
                    if (num_str.indexOf(this_num[c]) != -1) continue t;
                }
            }
            if (bull) {
                tmp_bull = 0;
                tmp_cow = 0;
                for (var a = 0; a < 4; ++a) {
                    if (this_num[a] == num[a]) {
                        ++tmp_bull;
                    }
                    if (cow) {
                        if (num_str.indexOf(this_num[a]) != -1) {
                            ++tmp_cow;
                        }
                    }
                }
                if (bull > tmp_bull) continue t;
                if (cow > tmp_cow) continue t;
            }
            if (bull === 0 && cow) {
                tmp_cow = 0;
                for (var b = 0; b < 4; ++b) {
                    if (this_num[b] == num[b]) continue t;
                    if (num_str.indexOf(this_num[b]) != -1) {
                        ++tmp_cow;
                    }
                }
                if (cow > tmp_cow) continue t;
            }
            tmp.push(this_num);
        }
        answers = tmp;
        tmp = [];
    }

    // generator the number of the AI, also buildAnswers() is possible 
    function randNum() {
        var nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        nums.sort(function() {
            return Math.random() - 0.5;
        });
        return nums[0] === 0 ? nums.slice(1, 5) : nums.slice(0, 4);
    }
}());