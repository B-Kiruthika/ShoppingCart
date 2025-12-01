const port=3000
const express=require('express')
const app=express()
const mongoose=require('mongoose') 
const jwt=require('jsonwebtoken')
const path=require('path')
const cors=require('cors')
const multer = require('multer')

app.use(express.json())
app.use(cors())

//Database connection
mongoose.connect("mongodb://127.0.0.1:27017/shoppingcart")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

//API creation
app.get('/',(req,res)=>{
    res.send('Express app is running')
})

//for image
const storage = multer.diskStorage({ 
    destination:'./upload/images',
     filename: (req, file, cb)=>{
         return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
         }
        })
const upload=multer({storage:storage})
app.use('/images',express.static('upload/images'))

//uploading image
app.post('/upload', upload.single('product'), (req,res)=>{
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
})


//for product
const Product=mongoose.model('Product',{
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:
    {
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    }
})


//for users
const Users=mongoose.model('Users',{
    name:{
        type:String
    },
    email:
    {
        type:String,
        unique:true,
    },
    password:
    {
        type:String,
    },
    cartData:
    {
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    },
})

//signup
app.post('/signup', async (req, res) => {
  try {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, errors: 'User already exists' });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) cart[i] = 0;
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
    res.json({ success: true, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

//login from
app.post('/login',async(req,res)=>{
    let user=await Users.findOne({email:req.body.email})
    if(user)
    {
        const pcompare=req.body.password===user.password
        if(pcompare)
        {
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom')
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:"Wrong password"})
        }
    }
    else{
            res.json({success:false,errors:"Wrong Email Id"})
        }
})


//adding product
app.post('/addproduct',async(req,res)=>{
    let products=await Product.find({})         //add body id+1 
    let id  
    if(products.length>0){
        let last_product_array=products.slice(-1)
        let last_product=last_product_array[0]
        id=last_product.id+1
    }
    else{
        id=1
    }
    const product =new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    await product.save()
    res.json({
        success:true,
        name:req.body.name
    })
})
//removing product
app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    res.json({
        success:true,
        name:req.body.name
    })
})

//get all products
app.get('/allproduct',async(req,res)=>{
    let products=await Product.find({})
    res.send(products)
})

//addtocart 
app.post('/addtocart', fetchUser,async (req, res)=>{
let userData = await Users.findOne({_id: req.user.id});
userData.cartData[req.body.itemId] += 1;
await Users.findOneAndUpdate({_id: req.user.id}, {cartData:userData.cartData})
res.send("Added")
})

//remove for cart
app.post('/removefromcart', fetchUser,async (req, res)=>{
let userData = await Users.findOne({_id: req.user.id});
userData.cartData[req.body.itemId] -= 1;
await Users.findOneAndUpdate({_id: req.user.id}, {cartData:userData.cartData})
res.send("Removed")
})

//getcart
app.post('/getcart', fetchUser, async (req, res)=>{
console.log("GetCart");
let userData = await Users.findOne({_id: req.user.id});
res.json(userData.cartData);
})

app.listen(port,(error)=>{
    if(!error)
    {
        console.log('Server running on port: '+port)
    }
    else{
        console.log('Error'+error)
    }
})