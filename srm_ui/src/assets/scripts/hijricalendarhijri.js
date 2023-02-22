  var cMoon=document.getElementById("myCanvas");
            var cxt=cMoon.getContext("2d");
            var viewportWidth = window.innerWidth;
            var viewportHeight = window.innerHeight;
            var canvasWidth = 100;
            var canvasHeight = 100;
            cMoon.setAttribute("width", canvasWidth);
            cMoon.setAttribute("height", canvasHeight);
            var n=31;
            var feb; 
            var leap;
            var ip;
            var theDay;

            arbMonths = ["1: Muharram", "2: Safar", "3: Rabi' Al Awwal", "4: Rabi' Al Thani", "5: Jumada  Al Awwal", "6: Jumada Al Thani", 
                                 "7: Rajab", "8: Sha'ban", "9: Ramadan", "10: Shawwal", "11: Dhou Al qi'da", "12: Dhou Al Hijja"];
            engMonths = ["1: January","2: February","3: March","4: April","5: May","6: June",
                                   "7: July","8: August","9: September","10: October","11: November","12: December"];
           WeekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            function Start()
            {
                FillLunarYearCombo();
                FillLunarMonthCombo();
                FillLunarDayCombo();
                FillSolarMonthCombo();
                FillSolarYearCombo();
                FillSolarDayCombo();
                MonthDays();
                SolarToLunar();
            }

             function DateMinError()

            {

                 window.alert("Minimum Gregorian date is (16/7/622), this date was the first day of Hijri calender.");
            }


             function DateMaxError()

            {

                 window.alert("Maximum Gregorian date is (17/12/2465).");
            }


            function FillSolarYearCombo()
            {
                for (var i=622;i<2466;i++)
                {
                    var optYear = new Option(i,i);
                    document.getElementById("cmbSolarYears").add(optYear, undefined);
                }
                var curDate = new Date();
                var y = curDate.getFullYear();
                MyForm.SolarYearCombo.value=y;
            }

            function FillLunarYearCombo()
            {
                for (var i=1;i<1901;i++)
                {
                    var optYear = new Option(i,i);
                    document.getElementById("cmbLunarYears").add(optYear, undefined);
                }
            }

            function FillSolarMonthCombo()
            {
                 for (var i=0;i<engMonths.length;i++)
                {
                    var optSolarMonth = new Option(engMonths[i],i+1);
                    document.getElementById("cmbSolarMonths").add(optSolarMonth, undefined);
                }
                var curDate = new Date();
                var month = curDate.getMonth();
                MyForm.SolarMonthCombo.value=month+1;
            }

            function FillLunarMonthCombo()
            {
                 for (var i=0;i<arbMonths.length;i++)
                {
                    var optMonth = new Option(arbMonths[i],i+1);
                    document.getElementById("cmbLunarMonths").add(optMonth, undefined);
                }
            }

            function FillSolarDayCombo()
            {
                for (var i=1;i<n+1;i++)
                {
                    var optDay = new Option(i,i);
                    document.getElementById("cmbSolarDays").add(optDay, undefined);
                }
                var curDate = new Date();
                var d = curDate.getDate();
                MyForm.SolarDayCombo.value=d;
            }

            function FillLunarDayCombo()
            {
                for (var i=1;i<31;i++)
                {
                    var optDay = new Option(i,i);
                    document.getElementById("cmbLunarDays").add(optDay, undefined);
                }
            }

            function CheckYear()
            {
                var y=parseInt(MyForm.SolarYearCombo.value);  
                if ((y%4)==0)
                {
                    if ((y%100)==0 && (y%400)!=0)
                        leap=false;
                    else
                        leap=true;
                }
                else
                    leap=false;
            } 

            function MonthDays()
            {
                var oldDay=parseInt(MyForm.SolarDayCombo.value);
                var m=parseInt(MyForm.SolarMonthCombo.value);
                switch(m)
                {
                    case 2:
                         CheckYear();  
                        if (leap)
                            feb=29;
                        else
                            feb=28;
                        n=feb;
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        n=30; 
                        break;
                    default:n=31;
                }
                document.forms["MyForm"].elements["SolarDayCombo"].options.length=0;
                FillSolarDayCombo();
                if(oldDay<=n)
                     MyForm.SolarDayCombo.value = oldDay;
                else
                     MyForm.SolarDayCombo.value = 1; 
            }

        function SolarToLunar()
        {
            var dd=parseInt(MyForm.SolarDayCombo.value);
            var mm=parseInt(MyForm.SolarMonthCombo.value);
            var yy=parseInt(MyForm.SolarYearCombo.value);
            ConvertSolarToLunar(dd, mm, yy);
            getAge(MyForm);
        }

        function LunarToSolar()
        {
            var dd=parseInt(MyForm.LunarDayCombo.value);
            var mm=parseInt(MyForm.LunarMonthCombo.value);
            var yy=parseInt(MyForm.LunarYearCombo.value);
            ConvertLunarToSolar(dd, mm, yy);
            getAge(MyForm);
        }

         function getInt(floatNum)
            {
                 if (floatNum< -0.0000001)
                {
	  return Math.ceil(floatNum-0.0000001);
                }
                return Math.floor(floatNum+0.0000001);
             }

         function ConvertSolarToLunar(d, m, y)
        {
            var jd;
            var j, l, r;
 
            if ((y>1582)||((y==1582)&&(m>10))||((y==1582)&&(m==10)&&(d>14))) 
           {
                jd = getInt((1461 * (y + 4800 + getInt((m - 14) / 12))) / 4) + getInt((367 * (m - 2 - 12 * (getInt((m - 14) / 12)))) / 12) -
                       getInt( (3* (getInt((y+4900+ getInt( (m-14)/12) )/100))) /4)+d-32075;
           }
           else
          {
                jd = 367 * y - getInt((7 * (y + 5001 + getInt((m - 9) / 7))) / 4) + getInt((275 * m) / 9) + d + 1729777;
           }
            if(jd<1948440)
           {
                  DateMinError();
                  return;
            }
            if(jd>2621734)
           {
                  DateMaxError();
                  return;
            }
            theDay=jd%7;
            //MyForm.thisDay.value= WeekDays[theDay];
            l=jd-1948440+10632;
            r=getInt((l-1)/10631);
            l=l-10631*r+354;
            j = (getInt((10985 - l) / 5316)) * (getInt((50 * l) / 17719)) + (getInt(l / 5670)) * (getInt((43 * l) / 15238));
            l = l - (getInt((30 - j) / 15)) * (getInt((17719 * j) / 50)) - (getInt(j / 16)) * (getInt((15238 * j) / 43)) + 29;
            m=getInt((24*l)/709);
            d=l-getInt((709*m)/24);
            y=30*r+j-30;
			
			return {
				day: d,
				month: m,
				year: y,
			};
            //MyForm.LunarDayCombo.value=d;
            //MyForm.LunarMonthCombo.value=m;
            //MyForm.LunarYearCombo.value=y;
        }

         function ConvertLunarToSolar(d, m, y)
        {
            var jd;
            var i, j, k, l, r;
            jd = getInt((11 * y + 3) / 30) + 354 * y + 30 * m - getInt((m - 1) / 2) + d + 1948440 - 385;
            theDay=jd%7;
            //MyForm.thisDay.value=WeekDays[theDay];
            if (jd > 2299160)
            {
                 l=jd+68569;
                r=getInt((4*l)/146097);
                 l=l-getInt((146097*r+3)/4);
                 i=getInt((4000*(l+1))/1461001);
                 l=l-getInt((1461*i)/4)+31;
                 j=getInt((80*l)/2447);
                d=l-getInt((2447*j)/80);
                l=getInt(j/11);
                m=j+2-12*l;
                y=100*(r-49)+i+l;
            }	
            else	
            {
                 j=jd+1402;
                 k=getInt((j-1)/1461);
                 l=j-1461*k;
                 r=getInt((l-1)/365)-getInt(l/1461);
                  i=l-365*r+30;
                  j=getInt((80*i)/2447);
                 d=i-getInt((2447*j)/80);
                  i=getInt(j/11);
                 m=j+2-12*i;
                 y=4*k+r+i-4716;
             }
			 return {
				day: d,
				month: m,
				year: y,
			};
            // MyForm.SolarDayCombo.value=d;
            // MyForm.SolarMonthCombo.value=m;
            // MyForm.SolarYearCombo.value=y;
        }

            function getAge(form)
            {
                 var ag=parseInt(MyForm.LunarDayCombo.value);
                if(ag==1)
                {
                    form.age.value=ag.toString()+" day";
                }
                else
                {
                    form.age.value=ag.toString()+" days";
                }
                ShowMoonPhase();
            }
        
            function ShowMoonPhase() 
            {
                 var ag=parseInt(MyForm.LunarDayCombo.value);
                 var Phase = ag / 29.530588853;
                 var Xpos;
                 var Ypos;
                 var Rpos;
                 var Xpos1;
                 var Xpos2;
                 cxt.fillStyle="blue";
                 cxt.fillRect(0,0,100,100);
                 cxt.stroke();
                 for (Ypos=0; Ypos<= 45; Ypos++)
                {
                      Xpos = Math.sqrt(45*45 - Ypos*Ypos);
                      // Draw darkness part of the moon
                      cxt.strokeStyle = "white";
                      cxt.beginPath();
                      cxt.moveTo(50-Xpos, Ypos+50);
                      cxt.lineTo(Xpos+50, Ypos+50);
                      cxt.stroke();
                      cxt.moveTo(50-Xpos, 50-Ypos);
                      cxt.lineTo( Xpos+50, 50-Ypos);
                      cxt.closePath();
                      cxt.stroke();
                      // Determine the edges of the lighted part of the moon
                      Rpos = 2 * Xpos;
                      if (Phase < 0.5)
                     {
                           Xpos1 = - Xpos;
                           Xpos2 = Rpos - 2*Phase*Rpos - Xpos;
                      }
                      else
                     {
                           Xpos1 = Xpos;
                           Xpos2 = Xpos - 2*Phase*Rpos + Rpos;
                      }
                      // Draw the lighted part of the moon
                      cxt.strokeStyle = "black";
                      cxt.beginPath();
                      cxt.moveTo(Xpos1+50, 50-Ypos);
                      cxt.lineTo(Xpos2+50, 50-Ypos);
                      cxt.stroke();
                      cxt.moveTo(Xpos1+50, Ypos+50);
                      cxt.lineTo( Xpos2+50, Ypos+50);
                      cxt.closePath();
                      cxt.stroke();
                 }
            }