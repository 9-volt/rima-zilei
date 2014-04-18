#!/usr/bin/env bash

echo "Looking for t gem"
which t
if [ $? -ne 0 ]
then
  echo "t gem not found, please use 'gem install t' and authorize"
  exit
fi

echo "fetching unimedia"
filename="feeds/$(date +'%d-%m-%Y').csv"
t timeline @unimediamd    -n 100 --csv > $filename
echo "fetching publika"
t timeline @publikatv     -n 100 --csv >> $filename
echo "fetching jurnal"
t timeline @jurnalmd      -n 100 --csv >> $filename
echo "fetching timpul"
t timeline @timpul        -n 100 --csv >> $filename
echo "fetching protv"
t timeline @ProTVChisinau -n 100 --csv >> $filename
echo "done!"


