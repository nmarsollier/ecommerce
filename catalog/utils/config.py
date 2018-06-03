import configparser

config = configparser.ConfigParser()
config.read("config.ini")


def getSecurityServerUrl():
    return getProperty("SecurityServerUrl", "localhost")


def getSecurityServerPort():
    return int(getProperty("SecurityServerPort", 3000))


def getRabbitServerUrl():
    return getProperty("RabbitServerUrl", "localhost")


def getDatabaseServerUrl():
    return getProperty("DatabaseServerUrl", "localhost")


def getDatabaseServerPort():
    return int(getProperty("DatabaseServerPort", 27017))


def getProperty(name, default):
    if ("DEFAULT" in config):
        if (name in config["DEFAULT"]):
            return config["DEFAULT"][name]
    return default
