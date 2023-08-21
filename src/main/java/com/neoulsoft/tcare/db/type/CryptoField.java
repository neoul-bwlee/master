package com.neoulsoft.tcare.db.type;


import com.neoulsoft.tcare.config.ServerConstants;
import com.neoulsoft.tcare.security.EnvCrypto;

public class CryptoField {

    protected transient Object origin = null;
    protected transient Class<?> originType = Object.class;

    public static final CryptoField LZERO = new CryptoField(0L);
    public static final CryptoField ZERO = new CryptoField((int) 0);
    public static final CryptoField EMPTY = new CryptoField("");
    public static final CryptoField GCC = new CryptoField("global.chat.channel");

    protected String encoded = null;

    public CryptoField() {
        origin = "";
    }

    public CryptoField(Object value) {
        origin = value;

        if (value != null) {
            Class<?> enclosingClass = value.getClass().getEnclosingClass();
            if (enclosingClass != null) {
                originType = enclosingClass;
            } else {
                originType = value.getClass();
            }
        }
        else {
            originType = String.class;
        }

        encode(origin);
    }

    public String valueOf() {
        return encoded;
    }

    public <T> T originOf() {
        return (T) origin;
    }

    public boolean isEmpty() {
        if (origin == null) return true;
        if (originType == Long.class && (Long) origin == 0L) return true;
        if (originType == Integer.class && (Integer) origin == 0) return true;
        if (originType == String.class && ((String) origin).isEmpty()) return true;
        return false;
    }

    @Override
    public boolean equals(Object target) {
        if (!(target instanceof CryptoField))
            return false;

        if (originTypeOf() != ((CryptoField) target).originTypeOf())
            return false;

        if (originTypeOf() == Long.class) {
            long lv = ((Long) origin).longValue();
            long tv = ((Long) ((CryptoField) target).originOf()).longValue();
            return lv == tv;
        } else if (originTypeOf() == Integer.class) {
            int lv = ((Integer) origin).intValue();
            int tv = ((Integer) ((CryptoField) target).originOf()).intValue();
            return lv == tv;
        } else if (originTypeOf() == String.class) {
            return ((String) origin).equals(((CryptoField) target).originOf());
        }

        return false;
    }

    public Class<?> originTypeOf() {
        return originType;
    }

    @Override
    public String toString() {
        return valueOf();
    }

    public static class NAuth extends CryptoField {

        public NAuth() { super(); }
        public NAuth(Object value) {
            super();

            origin = value;

            Class<?> enclosingClass = value.getClass().getEnclosingClass();
            if (enclosingClass != null) {
                originType = enclosingClass;
            } else {
                originType = value.getClass();
            }

            encode(origin);
        }

        @Override
        protected void encode(Object source) {
            if (source == null) {
                encoded = "";
            } else {
                try {
                    encoded = EnvCrypto.encrypt(ServerConstants.NAUTH_ENV_SECRET, originType.getName() + "|" + origin.toString());
                } catch (Exception e) {
                    encoded = "err_crypto";
                }
            }
        }

        public static NAuth decode(String source, Object defaultValue) {
            try {
                String decrypted = EnvCrypto.decrypt(ServerConstants.NAUTH_ENV_SECRET, source);
                if (decrypted == null || decrypted.trim().length() == 0)
                    throw new Exception("BadCrypto 복호화할 수 없습니다.");

                String[] splitted = decrypted.split("\\|");
                if (splitted == null || splitted.length != 2)
                    throw new Exception("BadCrypto 형식이 맞지 않습니다.");

                Class<?> clazz = Class.forName(splitted[0]);
                if (clazz == null)
                    throw new Exception("BadCrypto 지원하지 않는 형식입니다.");

                if (splitted[1] == null)
                    throw new Exception("BadCrypto 복호화할 수 없는 값입니다.");

                if (defaultValue instanceof Integer || clazz == Integer.class) {
                    if (splitted[1].indexOf(".") > -1)
                        splitted[1] = splitted[1].substring(0, splitted[1].indexOf("."));
                    int intValue = Integer.parseInt(splitted[1]);
                    return new NAuth(intValue);
                }

                if (defaultValue instanceof Long || clazz == Long.class) {
                    if (splitted[1].indexOf(".") > -1)
                        splitted[1] = splitted[1].substring(0, splitted[1].indexOf("."));
                    long longValue = Long.parseLong(splitted[1]);
                    return new NAuth(longValue);
                }

                if (clazz == String.class) {
                    return new NAuth(splitted[1]);
                }

                throw new Exception("BadCrypto 지원하지 않는 형식입니다.");
            } catch (Exception e) {
                return new NAuth(defaultValue);
            }
        }

        public static NAuth forcedDecode(String source) {
            try {
                String decrypted = EnvCrypto.decrypt(ServerConstants.NAUTH_ENV_SECRET, source);
                if (decrypted == null || decrypted.trim().length() == 0)
                    throw new Exception("BadCrypto 복호화할 수 없습니다.");

                String[] splitted = decrypted.split("\\|");
                if (splitted == null || splitted.length != 2)
                    throw new Exception("BadCrypto 형식이 맞지 않습니다.");

                Class<?> clazz = Class.forName(splitted[0]);
                if (clazz == null)
                    throw new Exception("BadCrypto 지원하지 않는 형식입니다.");

                if (splitted[1] == null)
                    throw new Exception("BadCrypto 복호화할 수 없는 값입니다.");

                if (clazz == Integer.class) {
                    int intValue = Integer.parseInt(splitted[1]);
                    return new NAuth(intValue);
                }

                if (clazz == Long.class) {
                    long longValue = Long.parseLong(splitted[1]);
                    return new NAuth(longValue);
                }

                if (clazz == String.class) {
                    return new NAuth(splitted[1]);
                }

                throw new Exception("BadCrypto 지원하지 않는 형식입니다.");
            } catch (Exception e) {
                System.out.println("CryptoField_Error : " + e.getMessage());
                return null;
            }
        }
    }

    public static CryptoField decode(String source, Object defaultValue) {
        try {
            String decrypted = EnvCrypto.decrypt(source);
            if (decrypted == null || decrypted.trim().length() == 0)
                throw new Exception("BadCrypto 복호화할 수 없습니다.");

            String[] splitted = decrypted.split("\\|");
            if (splitted == null || splitted.length != 2)
                throw new Exception("BadCrypto 형식이 맞지 않습니다.");

            Class<?> clazz = Class.forName(splitted[0]);
            if (clazz == null)
                throw new Exception("BadCrypto 지원하지 않는 형식입니다.");

            if (splitted[1] == null)
                throw new Exception("BadCrypto 복호화할 수 없는 값입니다.");

            if (defaultValue instanceof Integer || clazz == Integer.class) {
                if (splitted[1].indexOf(".") > -1)
                    splitted[1] = splitted[1].substring(0, splitted[1].indexOf("."));
                int intValue = Integer.parseInt(splitted[1]);
                return new CryptoField(intValue);
            }

            if (defaultValue instanceof Long || clazz == Long.class) {
                if (splitted[1].indexOf(".") > -1)
                    splitted[1] = splitted[1].substring(0, splitted[1].indexOf("."));
                long longValue = Long.parseLong(splitted[1]);
                return new CryptoField(longValue);
            }

            if (clazz == String.class) {
                return new CryptoField(splitted[1]);
            }

            throw new Exception("BadCrypto 지원하지 않는 형식입니다.");
        } catch (Exception e) {
            return new CryptoField(defaultValue);
        }
    }

    public static CryptoField forcedDecode(String source) {
        try {
            String decrypted = EnvCrypto.decrypt(source);
            if (decrypted == null || decrypted.trim().length() == 0)
                throw new Exception("BadCrypto 복호화할 수 없습니다.");

            String[] splitted = decrypted.split("\\|");
            if (splitted == null || splitted.length != 2)
                throw new Exception("BadCrypto 형식이 맞지 않습니다.");

            Class<?> clazz = Class.forName(splitted[0]);
            if (clazz == null)
                throw new Exception("BadCrypto 지원하지 않는 형식입니다.");

            if (splitted[1] == null)
                throw new Exception("BadCrypto 복호화할 수 없는 값입니다.");

            if (clazz == Integer.class) {
                int intValue = Integer.parseInt(splitted[1]);
                return new CryptoField(intValue);
            }

            if (clazz == Long.class) {
                long longValue = Long.parseLong(splitted[1]);
                return new CryptoField(longValue);
            }

            if (clazz == String.class) {
                return new CryptoField(splitted[1]);
            }

            throw new Exception("BadCrypto 지원하지 않는 형식입니다.");
        } catch (Exception e) {
            System.out.println("CryptoField_Error : " + e.getMessage());
            return null;
        }
    }

    protected void encode(Object source) {
        if (source == null) {
            encoded = "";
        } else {
            try {
                encoded = EnvCrypto.encrypt(originType.getName() + "|" + origin.toString());
            } catch (Exception e) {
                encoded = "err_crypto";
            }
        }
    }

    public static void main(String[] args) {
        System.out.println(GCC);
        System.out.println(LZERO);
        System.out.println(EMPTY);
        System.out.println(new CryptoField(80000022L).valueOf());
/*
        CryptoField privKey = new CryptoField("{\"address\":\"01839a2765238051973e06bf65f3e618e9c66a5e\",\"id\":\"de1bf0f2-6923-4e34-9221-07c65b234c2f\",\"version\":3,\"crypto\":{\"cipher\":\"aes-128-ctr\",\"ciphertext\":\"7b8f9b9fd634f566d29c5a234c974aa3fa33b21d7dd075ff46c5bf0508a38b80\",\"cipherparams\":{\"iv\":\"2841b510e59250ed10377548398d7173\"},\"kdf\":\"scrypt\",\"kdfparams\":{\"dklen\":32,\"n\":4096,\"p\":6,\"r\":8,\"salt\":\"8b39579a18c0b4f20becec35e8c70b1af522e46426b34d372551557a54bcd223\"},\"mac\":\"dd6a809c234b3f62c96aabeeff3d2e4559e985322f94d644069b24af62c28e24\"}}");
        System.out.println(new CryptoField(privKey.valueOf()));

        CryptoField decPrivKey = CryptoField.decode("c0013e425d3893b2acb9872a5878ea7d178eafbe7b3602042455f74888ba1f16003088d6168f6c5ef6c6ec32ecf7f0e9836a5c6e6af3db00b72b06675fd7ee9b3bbf44baead3ec365dafc7074059a7be136afd0562756954bfccf1188b51312360faf91a9606d83e54185f9911940ba1db9a818cd9c32054c8fd03c3ff9e9f9aadc559d77d8e48da971bd760735363b193b31c15c849f40bc2a330db2388b5ca5f14b037560527f96811180f6af468ba3223de9843ae0ad53e997eece70842a9e3c81915aca1f947912acd411537e84d0e58a8c2c081207b20a26ea6182f09b6b9f34a48848dc841c9cdacf037eaa86ff56b055a10a9b6dba9576330d691409ecc19211f29fa3141db2fa071f220d9015adbdd4cde33ddc3d1fc6a43b6f1402355c11769435b4cf5df751d7a8be77202c8dce8d5703aa0cd240105461ed7166a2cb2e7ff457ba182a8d9fd90e4107493707937d8bd89f8cadabdfb55056e167c7804963091898809b1f098cec51f4fbb406452dd19299953768c7dc0a70a685189b40b5548d298438589866bcc140d30250c9c96e368359af0314271abf5e776e9c3f46f175b96760b36f43153a58d8be5147f8dd1ea549821798c2c02a7409edc1ac78a1c3d51fe8ca45521b157490d5240a2f7517686ad493fa8128b8faff73069c25b55df8824e876c87e4f0c6594d8d4a921aa76f4f7ca18c13c47014b0c23901e49ffa377e6bb7f3b15ad7a0185cf593f2c153b46d8052329b05123966f8bd9a10173a171cf3b248602ad374b5ccb4a9f957c2f5d681abb2e6fb6c0d296e4a5e9b75803bacc2ccb8050e98f87e5d9743891fa2bd3d90f5338816b5dad3b6da87bed0ee524ac01deb711e75ddfc0cfecfc71c95514d24d81fcc578dbe5f41867d1403275472d37fca6d05381547c719057fade8db414332227dc262f486269cdfc8df83c786c63565ea83061efc11b50da4ec438d1f88c89b351fcb0759eff5b81c80fbe97fda01f865dfac1ac301175b06e3d9ebbdea18d6ef10962afc8cba718a17082155339a3e985c90e97d1fb9a254f30f0b41f7c6079393ad7a9249aabf85d69ac1a308273c6e949465d1624a0c18459bb7b9cae3cc22c9f12f18ac161bdee4dda14c68cc4a630af9f8536441e275ce013521e05f7301e3674343ddfa510288bec0d08b4b813eabc0363c2efc9599816a865cb1e4904a65b618d81cc9e077ffd4d2a635d99d16be515f433a7b04c2013ff26918b58418887100760a5f6fca4eb44340542667e5d919e4b3fb03bf2c940166ee0bd431fe479909219c9ab3e95d94400df8f8466be2039746d43478236c355f2902eaf67a061ce0d52b5d3fa9d0023707379641e0725085f6f0a8602624b11f4cdd0ab5f3ce6bd11d2429fc6951c602fc7b08fe1a0d535001c39268341175e5420f93ce91313fc460397b2c46f52166e2bbf48974b66fa4b4ca439b52d549aef911bacea1ef4b4a23c", "");
        CryptoField decJson = CryptoField.decode(decPrivKey.originOf(), "");
        System.out.println((String) decJson.originOf()); */
    }
}
