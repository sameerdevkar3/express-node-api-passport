import passport, { authenticate } from 'passport'

function initializePassport()
{
    const authenticateUser = (email,password,done) =>
    {
        const user = getUserByEmail(email);
        if(user)
        {
            return done(null,false,{message:'No user found'});
        }
        try {
            
        } catch (error) {

        }
    }
    passport.use(new LocalStrategy({email:'email'}),authenticateUser)

    passport.serializeUser((user,done) => {});
    passport.deserializeUser((id,done) => {});
}