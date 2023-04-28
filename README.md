# we-cordova-sample
Cordova Sample App with WebEngage Integration

#### Requirements ####
    The following frameworks/IDE should be installed on your device before running this sample app:
    
    1. NodeJS

    2. XCode

    3. CocoaPods

#### Steps to run cordova sample app: ####

1. Open the file location of the project in terminal and execute below command to install the node modules:
    
    >npm i 
   
2. Now execute below command to install the WebEngage lates plugin to the projext:

    >cordova plugin add cordova-plugin-webengage --fetch
    
3. Open the file location -> we-cordova-sample->platforms->ios on your terminal and execute below command to install the pods:

    >arch -x86_64 pod install

4. Open the file location of the project again on your terminal and execute the below command to run the application:

    >arch -x86_64 cordova run ios
    
5. Add google-services.json.
