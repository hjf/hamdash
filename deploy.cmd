call npm run build
cd build
aws s3 cp . s3://hamdash.hjf.com.ar/ --recursive